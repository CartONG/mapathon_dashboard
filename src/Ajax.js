'use strict';

import moment from 'moment';
import osmtogeojson from 'osmtogeojson';
import { GeoJSON } from 'leaflet';
import PubSub from './PubSub';
import { setProjectData, setBBox, setChangesets, setOsmDataAndLeaderboard, updateChangesetsAndOsmData, setError } from './Actions';
import { HOTOSM_API_URL, OSM_API_URL, OVP_DE } from './Variables';
import { BAD_REQUEST, CONNECTION_TIMEOUT, INVALID_PROJECT_ID, TOO_MANY_REQUESTS, UNKNOWN_ERROR } from './Errors';
import { computeLeaderboard } from './Leaderboard';
import { sumLines, sumAreas } from './Calculations';

const requests = [];

function sendXHR(url) {
  return new Promise((resolve, reject) => {
    if(requests.length>0)
    {
      const lastRequest = requests.pop();
      lastRequest.abort();
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      requests.pop();
      switch(xhr.status)
      {
        case 200:
          resolve(xhr.responseText);
          break;
        case 400:
          PubSub.publish('ACTIONS', setError({errorMessage: BAD_REQUEST.format(url)}));
          break;
        case 429:
          PubSub.publish('ACTIONS', setError({errorMessage: TOO_MANY_REQUESTS.format(url)}));
          break;
        default:
          reject(Error(xhr.responseText));
          break;
      }
    };
    xhr.onerror = (error) => {
      console.warn(error);
      PubSub.publish('ACTIONS', setError({errorMessage: UNKNOWN_ERROR}));
    };
    xhr.ontimeout = (timeoutEvent) => {
      console.warn(timeoutEvent);
      PubSub.publish('ACTIONS', setError({errorMessage: CONNECTION_TIMEOUT.format(url)}));
    };
    xhr.send();
    requests.push(xhr);
  });
}

export function getProjectData(projectId) {
  const url = HOTOSM_API_URL + projectId + '/summary';
  sendXHR(url).then(data => {
    const projectData = JSON.parse(data);
    PubSub.publish('ACTIONS', setProjectData(projectData));
  }, error =>
  {
    PubSub.publish('ACTIONS', setError({errorMessage: INVALID_PROJECT_ID.format(projectId)}));
  });
};

export function getBBox(projectId) {
  const url = HOTOSM_API_URL + projectId;
  sendXHR(url).then(data => {
    const projectData = JSON.parse(data);
    const b = new GeoJSON(projectData.areaOfInterest).getBounds();
    const bbox = { w: b.getWest(), s: b.getSouth(), e: b.getEast(), n: b.getNorth() };
    const crash = 1 / 0;
    PubSub.publish('ACTIONS', setBBox(bbox));
  });
};

function buildURL(bbox, startUtc, endUtc) {
  const bboxString = 'bbox=' + bbox.w + ',' + bbox.s + ',' + bbox.e + ',' + bbox.n;
  const timeString = 'time=' + startUtc + ',' + endUtc;
  return OSM_API_URL + 'changesets?' + bboxString + '&' + timeString + '&' + 'closed=true';
}

function getChangesetsWithCallback(bbox, start, end, projectId, callback)
{
  const tmpStart = moment(start), tmpEnd = moment(end);
  const url = buildURL(bbox, tmpStart.utc().format(), tmpEnd.utc().format());
  const changesetsIds = [];

  sendXHR(url).then(getChangesetsFromXml);

  function getChangesetsFromXml(data) {
    const selector = 'tag[v*="#hotosm-project-' + projectId + '"]';
    const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');

    const changesets = xmlDoc.querySelectorAll('changeset');
    const tagElmts = xmlDoc.querySelectorAll(selector);

    const obj = {};
    Array.from(tagElmts).map(t => obj[t.parentNode.id] = 0);
    Object.keys(obj).map(changesetId => changesetsIds.push(changesetId));

    if(changesets.length === 100) {
      const newEnd = changesets[99].getAttribute('closed_at');
      const newUrl = buildURL(bbox, tmpStart.utc().format(), newEnd);
      sendXHR(newUrl).then(getChangesetsFromXml);
    } else {
      callback(changesetsIds);
    }
  }
}

export function getChangesets(bbox, start, end, projectId) {
  function publishCallback(changesetsIds)
  {
    PubSub.publish('ACTIONS', setChangesets(changesetsIds));
  };
  getChangesetsWithCallback(bbox, start, end, projectId, publishCallback);
};

function buildOAPIReqWithoutEndDate(server, bbox, type, startDate) {
  return server + '?data=[bbox:' + bbox.s + ',' + bbox.w + ',' + bbox.n + ',' + bbox.e + '];'
    + 'way[' + type + '](newer:"' + startDate.utc().format() + '");'
    + '(._;>;);out+meta;';
};

function buildOAPIReqWithEndDate(server, bbox, type, startDate, endDate) {
  return server + '?data=[bbox:' + bbox.s + ',' + bbox.w + ',' + bbox.n + ',' + bbox.e + '];'
    + 'way[' + type + '](changed:"' + startDate.utc().format() + '","' + endDate.utc().format() + '");'
    + '(._;>;);out+meta;';
};

function getOSMBuildingsWithCallback(bbox, startDateTime, endDateTime, server, changesets, callback) {
  const OSMData = {};
  const tmpStart = moment(startDateTime), tmpEnd = moment(endDateTime);
  const types = ['building','landuse','highway','waterway'];
  const requests = types.map(type => {
    return OVP_DE ? buildOAPIReqWithEndDate(server, bbox, type, tmpStart, tmpEnd)
      : buildOAPIReqWithoutEndDate(server, bbox, type, tmpStart)
  });

  sendXHR(requests[0]).then(data => {//building
    OSMData[types[0]] = getFeatures(data);
    return sendXHR(requests[1]);
  })
  .then(data => {//landuse
    OSMData[types[1]] = getFeatures(data);
    return sendXHR(requests[2]);
  })
  .then(data => {//highway
    OSMData[types[2]] = getFeatures(data);
    return sendXHR(requests[3]);
  })
  .then(data => {//waterway
    OSMData[types[3]] = getFeatures(data);
    callback(OSMData);
  });

  function getFeatures(data) {
    const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
    const featureCollection = osmtogeojson(xmlDoc);
    const newFeatures = featureCollection.features
      .filter(feature => changesets.indexOf(feature.properties.changeset) > -1);
    featureCollection.features = newFeatures;
    return featureCollection;
  };
};

function lengthAndAreaCalculations(OSMData)
{
  const calculations = {};
  calculations.roadLength = sumLines(OSMData['highway']['features']);
  calculations.waterwayLength = sumLines(OSMData['waterway']['features']);
  calculations.residentialLanduse = sumAreas(OSMData['landuse']['features'], true);
  calculations.totalLanduse = sumAreas(OSMData['landuse']['features'], false);
  return calculations;
};

export function getOSMBuildings(bbox, startDateTime, endDateTime, server, changesets) {
  function publishCallback(OSMData)
  {
    const data = {};
    data.OSMData = OSMData;
    data.leaderboard = computeLeaderboard(data.OSMData);
    data.calculations = lengthAndAreaCalculations(data.OSMData);
    PubSub.publish('ACTIONS', setOsmDataAndLeaderboard(data));
  };
  getOSMBuildingsWithCallback(bbox, startDateTime, endDateTime, server, changesets, publishCallback);
};

export function refreshData(bbox, startDateTime, endDateTime, projectId, server)
{
  function changesetsCallback(changesets)
  {
    function updateCallback(OSMData)
    {
      const data = {};
      data.changesets = changesets;
      data.OSMData = OSMData;
      data.leaderboard = computeLeaderboard(data.OSMData);
      data.calculations = lengthAndAreaCalculations(data.OSMData);
      PubSub.publish('ACTIONS', updateChangesetsAndOsmData(data));
    };
    getOSMBuildingsWithCallback(bbox, startDateTime, endDateTime, server, changesets, updateCallback);
  };
  getChangesetsWithCallback(bbox, startDateTime, endDateTime, projectId, changesetsCallback);
};