'use strict';

import moment from 'moment';
import osmtogeojson from 'osmtogeojson';
import { GeoJSON } from 'leaflet';
import PubSub from './PubSub';
import { setProjectData, setBBox, setChangesets, setOsmData } from './Actions';
import { HOTOSM_URL, OSM_API_URL, OVP_DE } from './Variables';
import { getTotalDistance } from './Distance';

function sendXHR(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if(xhr.status === 200)
      {
        resolve(xhr.responseText);
      }
      else
      {
        reject(Error(xhr.responseText));
      }
    };
    xhr.onerror = () => reject(Error(xhr.responseText));
    xhr.send();
  });
}

export function getProjectData(projectId) {
  const url = HOTOSM_URL + projectId + '/summary';
  sendXHR(url).then(data => {
    const projectData = JSON.parse(data);
    PubSub.publish('ACTIONS', setProjectData(projectData));
  }, error =>
  {
    console.log(error);
  });
}

export function getBBox(projectId) {
  const url = HOTOSM_URL + projectId;
  sendXHR(url).then(data => {
    const projectData = JSON.parse(data);
    const b = new GeoJSON(projectData.areaOfInterest).getBounds();
    const bbox = { w: b.getWest(), s: b.getSouth(), e: b.getEast(), n: b.getNorth() };
    const crash = 1 / 0;
    PubSub.publish('ACTIONS', setBBox(bbox));
  });
}

export function getChangesets(bbox, start, end, projectId) {
  const tmpStart = moment(start), tmpEnd = moment(end);
  const url = buildURL(bbox, tmpStart.utc().format(), tmpEnd.utc().format());
  const changesetsIds = [];

  sendXHR(url).then(callBack);

  function callBack(data) {
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
      sendXHR(newUrl).then(callBack);
    } else {
      PubSub.publish('ACTIONS', setChangesets(changesetsIds));
    }
  }

  function buildURL(bbox, startUtc, endUtc) {
    const bboxString = 'bbox=' + bbox.w + ',' + bbox.s + ',' + bbox.e + ',' + bbox.n;
    const timeString = 'time=' + startUtc + ',' + endUtc;
    return OSM_API_URL + 'changesets?' + bboxString + '&' + timeString + '&' + 'closed=true';
  }
}

function buildOAPIReqWithoutEndDate(server, bbox, type, startDate) {
  return server + '?data=[bbox:' + bbox.s + ',' + bbox.w + ',' + bbox.n + ',' + bbox.e + '];'
    + 'way[' + type + '](newer:"' + startDate.utc().format() + '");'
    + '(._;>;);out+meta;';
}

function buildOAPIReqWithEndDate(server, bbox, type, startDate, endDate) {
  return server + '?data=[bbox:' + bbox.s + ',' + bbox.w + ',' + bbox.n + ',' + bbox.e + '];'
    + 'way[' + type + '](changed:"' + startDate.utc().format() + '","' + endDate.utc().format() + '");'
    + '(._;>;);out+meta;';
}

export function getOSMBuildings(bbox, startDateTime, endDateTime, server, changesets) {
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
    PubSub.publish('ACTIONS', setOsmData(OSMData));
  });

  function getFeatures(data) {
    const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
    const featureCollection = osmtogeojson(xmlDoc);
    const newFeatures = featureCollection.features
      .filter(feature => changesets.indexOf(feature.properties.changeset) > -1);
    featureCollection.features = newFeatures;
    return featureCollection;
  }
}
