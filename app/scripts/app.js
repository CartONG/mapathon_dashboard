/* eslint-env browser */

'use strict';

import L from 'leaflet';
import jquery from 'jquery';
import Rx from 'rx-lite';
import moment from 'moment';
import lineDistance from '@turf/line-distance';
import area from '@turf/area';
import {point, lineString} from '@turf/helpers';
import destination from '@turf/destination';
import osmtogeojson from 'osmtogeojson';
import dialogPolyfill from 'dialog-polyfill';

import 'material-design-lite';
import './getmdl-select';

import taskTpl from '../tpl/task.pug';

import conf from '../data/conf.json';

const HOTOSM_URL = 'http://tasks.hotosm.org/project/';

const SERVERS = {
  'overpass-api.de': 'https://overpass-api.de/api/interpreter',
  'overpass.osm.rambler.ru': 'http://overpass.osm.rambler.ru/cgi/interpreter',
  'api.openstreetmap.fr': 'http://api.openstreetmap.fr/oapi/interpreter'
};

const OV_MAP_OPTS = {
  layers: [L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
    attribution: 'Map tiles by <a href="" target="_blank">korona.geog.uni-heidelberg.de</a> <br>Map data &copy; <a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">ODbL</a>',
    maxZoom: 19
  })]
};

const HW_MAP_OPTS = {
  center: [45.58789, 5.9215],
  zoom: 10,
  layers: [L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com" target="_blank">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0" target="_blank">CC BY 3.0</a> <br>Map data &copy; <a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">ODbL</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'})]
};

const HW_MAP_DEPT_OPTS = {
  radius: 7,
  fill: true,
  fillColor: '#1a9641',
  fillOpacity: 1,
  stroke: true,
  weight: 2,
  color: '#ffffff'
};

const HW_MAP_END_OPTS = {
  radius: 7,
  fill: true,
  fillColor: '#d7191c',
  fillOpacity: 1,
  stroke: true,
  weight: 2,
  color: '#ffffff'
};

const HW_LINE_OPTS = {
  weight: 5,
  opacity: 0.5
};

function add0ifNecessary(number) {
  return number < 10 ? '0' + number : String(number);
}

function initFormValues(taskId, stDay, stMonth, stYear, stHour, stMin, endDay, endMonth, endYear, endHour, endMin, server, formMsg) {

  const inputs = [taskId, stDay, stMonth, stYear, stHour, stMin, endDay, endMonth, endYear, endHour, endMin];
  const now = moment();

  taskId.value = '';

  now.add(-1, 'hour');
  stDay.value = add0ifNecessary(now.get('date'));
  stMonth.value = add0ifNecessary(now.get('month') + 1);
  stYear.value = now.get('year');
  stHour.value = add0ifNecessary(now.get('hour'));
  stMin.value = '00';

  now.add(2, 'hour');
  endDay.value = add0ifNecessary(now.get('date'));
  endMonth.value = add0ifNecessary(now.get('month') + 1);
  endYear.value = now.get('year');
  endHour.value = add0ifNecessary(now.get('hour'));
  endMin.value = '00';

  server.dispatchEvent(new Event('change'));
  formMsg.innerText = '';

  inputs.forEach(input => {
    const parent = input.parentNode;
    input.dispatchEvent(new Event('change'));
    L.DomUtil.removeClass(parent, 'is-dirty');
    L.DomUtil.removeClass(parent, 'is-invalid');
  });
}

function displayDialog(dialog) {
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  dialog.showModal();
}

function mapBbox(geosjon) {
  const bounds = L.geoJson(geosjon, {}).getBounds();
  return bounds._southWest.lat + ',' + bounds._southWest.lng + ',' + bounds._northEast.lat + ',' + bounds._northEast.lng;
}

function displayOverviewMap(state) {
  const map = L.map('overview-map', OV_MAP_OPTS);
  const taskLayer = L.geoJson(state.data.task, {style: conf.STYLES.task}).addTo(map);
  L.geoJson(state.data.landuse.geosjon, {style: conf.STYLES.landuse}).addTo(map);
  L.geoJson(state.data.highway.geosjon, {style: conf.STYLES.highway}).addTo(map);
  L.geoJson(state.data.buildings.geosjon, {style: conf.STYLES.building}).addTo(map);
  L.geoJson(state.data.waterway.geosjon, {style: conf.STYLES.waterway}).addTo(map);
  map.fitBounds(taskLayer.getBounds());
  return map;
}

function displayHighwayhMap(state) {
  const start = state.location === null ? point([5.9215, 45.58789]) : point(state.location);
  const end = destination(start, state.data.highway.dist, 90, 'kilometers');
  const startLayer = L.circleMarker([start.geometry.coordinates[1], start.geometry.coordinates[0]], HW_MAP_DEPT_OPTS);
  const endLayer = L.circleMarker([end.geometry.coordinates[1], end.geometry.coordinates[0]], HW_MAP_END_OPTS);
  const line = lineString([start.geometry.coordinates, end.geometry.coordinates]);
  const lineLayer = L.geoJson(line, HW_LINE_OPTS);
  const layers = state.data.highway.dist > 1 ? [lineLayer, startLayer, endLayer] : [];
  const highwayMap = layers.reduce((map, layer) => map.addLayer(layer), L.map('highway-map', HW_MAP_OPTS));
  highwayMap.fitBounds(lineLayer.getBounds(), {padding: [16, 16], maxZoom: 18});
  return highwayMap;
}

function displayTaskProgression(task) {
  const doneProgressBar = document.getElementById('task-progress-done');
  const validProgressBar = document.getElementById('task-progress-valid');
  doneProgressBar.MaterialProgress.setProgress(task.properties.done);
  validProgressBar.MaterialProgress.setProgress(task.properties.validated);
}

function calcArea(geosjonFeatures) {
  let surface = geosjonFeatures.reduce((acc, curr) => acc + area(curr), 0);
  surface /= 1000000;
  return Math.round(surface * 100) / 100;
}

function displayErrorMessage(loadingProgress, loadingMessage, loadingCloseButton, error) {
  console.error(error);
  loadingProgress.MaterialProgress.setProgress(0);
  L.DomUtil.addClass(loadingProgress, 'hide');
  L.DomUtil.addClass(loadingMessage, 'loading-error');
  loadingMessage.innerText = 'An error occured while downloading data!';
  L.DomUtil.removeClass(loadingCloseButton, 'hide');
}

function addTask(drawerNav, drawerNewTask, taskMenu, newTaskItem, state) {
  let links = drawerNav.querySelectorAll('.task-item');
  let createNewElements = true;

  links.forEach(item => {
    if (item.innerText === 'TASK #' + state.params.taskId) {
      item.href = window.location.href;
      createNewElements = false;
    }
  });

  if (!createNewElements) { // eslint-disable-line no-negated-condition
    links = taskMenu.querySelectorAll('a');
    links.forEach(item => {
      if (item.innerHTML === 'Task #' + state.params.taskId) {
        item.href = window.location.href;
      }
    });
  } else {
    const newElementDrawer = document.createElement('a');
    const newElementTaskMenu = document.createElement('li');
    const newLinkTaskMenu = document.createElement('a');
    // Add task to drawer menu
    newElementDrawer.setAttribute('class', 'mdl-navigation__link task-item');
    newElementDrawer.setAttribute('href', window.location.href);
    newElementDrawer.innerText = 'Task #' + state.data.task.id;
    drawerNav.insertBefore(newElementDrawer, drawerNewTask);
    // Add task to task menu
    newLinkTaskMenu.setAttribute('href', window.location.href);
    newLinkTaskMenu.innerText = 'Task #' + state.data.task.id;
    newElementTaskMenu.setAttribute('class', 'mdl-menu__item task-item');
    newElementTaskMenu.appendChild(newLinkTaskMenu);
    taskMenu.insertBefore(newElementTaskMenu, newTaskItem);
  }
}

function validURLParams(URLParams) {
  const UTC = '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z';
  const oneDate = '^\/#taskId=[0-9]{1,6}&stDate=' + UTC + '&server=(http:\/\/overpass.osm.rambler.ru\/cgi\/interpreter|http:\/\/api.openstreetmap.fr\/oapi\/interpreter)';
  const twoDate = '^\/#taskId=[0-9]{1,6}&stDate=' + UTC + '&endDate=' + UTC + '&server=https:\/\/overpass-api.de\/api\/interpreter$';
  const oneDateReg = new RegExp(oneDate);
  const twoDateReg = new RegExp(twoDate);
  return (oneDateReg.test(URLParams) || twoDateReg.test(URLParams));
}

function validStartDateOnly(task, startDate) {
  return /^[0-9]{1,6}$/i.test(task) && moment(startDate, 'DD/MM/YYYY HH:mm').isValid();
}

function validStartAndEndDate(task, startDate, endDate) {
  return /^[0-9]{1,6}$/i.test(task) && moment(startDate, 'DD/MM/YYYY HH:mm').isValid() && moment(endDate, 'DD/MM/YYYY HH:mm').isValid();
}

function buildOAPIReqWithoutEndDate(server, bbox, type, startDate) {
  // const stD = moment(startDate, 'DD/MM/YYYY HH:mm');
  return server + '?data=[bbox:' + bbox + '];way[' + type + '](newer:"' + startDate + '");(._;>;);out+meta;';
}

function buildOAPIReqWithEndDate(server, bbox, type, startDate, endDate) {
  // const stD = moment(startDate, 'DD/MM/YYYY HH:mm');
  // const endD = moment(endDate, 'DD/MM/YYYY HH:mm');
  return server + '?data=[bbox:' + bbox + '];way[' + type + '](changed:"' + startDate + '","' + endDate + '");(._;>;);out+meta;';
}

function handleEndDateInputs(currDash, dom) {
  const inputs = [dom.endDay, dom.endMonth, dom.endYear, dom.endHour, dom.endMin];
  const disable = (currDash.params.server !== 'https://overpass-api.de/api/interpreter');
  inputs.forEach(input => {
    input.disabled = disable;
  });
}

function buildDom() {
  const dom = {};
  // New dashboard related
  dom.newTaskDialog = document.getElementById('new-task-dialog');
  dom.taskId = document.getElementById('task-id');
  dom.stDay = document.getElementById('start-day');
  dom.stMonth = document.getElementById('start-month');
  dom.stYear = document.getElementById('start-year');
  dom.stHour = document.getElementById('start-hour');
  dom.stMin = document.getElementById('start-min');
  dom.endDay = document.getElementById('end-day');
  dom.endMonth = document.getElementById('end-month');
  dom.endYear = document.getElementById('end-year');
  dom.endHour = document.getElementById('end-hour');
  dom.endMin = document.getElementById('end-min');
  dom.server = document.getElementById('server-select');
  dom.newTaskMsg = document.getElementById('new-task-message');
  dom.submitTask = document.getElementById('dialog-submit-button');
  dom.newTaskCloseButton = document.getElementById('dialog-close-button');
  // Layout
  dom.layout = document.getElementById('layout');
  // Loading dialog related
  dom.loadingDialog = document.getElementById('loading-dialog');
  dom.loadingProgress = document.getElementById('loading-progress');
  dom.loadingMessage = document.getElementById('loading-message');
  dom.loadingCloseButton = document.getElementById('loading-close-button');
  // Task list related
  dom.taskMenu = document.getElementById('task-menu');
  dom.newTaskItem = document.getElementById('new-task-item');
  dom.taskMenuNewTask = document.getElementById('task-menu-new-task');
  dom.drawer = document.getElementById('drawer');
  dom.drawerNav = document.getElementById('drawer-nav');
  dom.drawerNewTask = document.getElementById('drawer-new-task');
  // Hooks
  dom.taskContainer = document.getElementById('task-container');
  return dom;
}

function reducers(actions) {

  function updateUsersData(usersData, geosjonFeatures, type) {
    return geosjonFeatures.reduce((acc, feature) => {
      let user = acc.find(user => user.id === feature.properties.user);

      if (user === undefined) {
        user = {id: feature.properties.user, edits: 0};
        acc.push(user);
      }

      if (user[type] === undefined) {
        user[type] = 0;
      }

      user.edits++;

      switch (type) { // eslint-disable-line default-case
        case 'buildings':
          user.buildings++;
          break;
        case 'landuse':
          user[type] = user.landuse + calcArea([feature]);
          break;
        case 'highway':
          user[type] = user.highway + (Math.round(lineDistance(feature, 'kilometers'), 0) * 10) / 10;
          break;
        case 'waterway':
          user[type] = user.waterway + (Math.round(lineDistance(feature, 'kilometers'), 0) * 10) / 10;
          break;
      }

      return acc;
    }, usersData);
  }

  function finalizeUsersData(usersData) {
    return usersData.reduce((acc, userData) => {
      const types = ['buildings', 'landuse', 'highway', 'waterway'];
      types.forEach(type => {
        if (userData[type] === undefined) {
          userData[type] = 0;
        }
      });
      acc.push(userData);
      return acc;
    }, []);
  }

  const locationStatusRed$ = actions.locationStatus$
    .map(x => {
      return function(state) {
        state.location = x;
        return state;
      };
    });

  const cancelProcessRed$ = actions.cancelProcess$
    .map(() => {
      return function(state) {
        state.params = undefined;
        state.data = undefined;
        state.location = undefined;
        return state;
      };
    });

  const openNewDashDialogRed$ = actions.openNewDashDialog$
    .map(() => {
      return function(state) {
        state.params = null;
        state.data = undefined;
        state.location = undefined;
        return state;
      };
    });

  const changeServerRed$ = actions.changeServer$
    .map(x => {
      return function(state) {
        state.params = {};
        state.params.server = x;
        return state;
      };
    });

  const unvalidInputsRed$ = actions.unvalidInputs$
    .map(() => {
      return function(state) {
        state.data = null;
        return state;
      };
    });

  const validInputsRed$ = actions.validInputs$
    .map(x => {
      return function(state) {
        state.data = {};
        state.params = {};
        state.params.taskId = x.taskId;
        state.params.startDate = x.startDate;
        state.params.endDate = x.endDate;
        state.params.server = x.server;
        return state;
      };
    });

  const getURLParamsRed$ = actions.getURLParams$
    .map(x => {
      return function(state) {
        state.params = {};
        state.data = {};
        state.params.taskId = x.taskId;
        state.params.startDate = x.startDate;
        state.params.endDate = x.endDate;
        state.params.server = x.server;
        state.data.task = null;
        state.location = undefined;
        return state;
      };
    });

  const getTaskDataRed$ = actions.getTaskData$
    .map(x => {
      return function(state) {
        if (x.properties === undefined) {
          state.data.task = 'error';
        } else {
          state.data.task = x;
          state.data.task.properties.formatCreated = moment(x.properties.created).format('DD/MM/YYYY');
          state.data.task.properties.formatLastUpdate = moment(x.properties.last_update).format('DD/MM/YYYY HH:mm');
          state.data.task.properties.validated = Math.round(x.properties.validated * 10) / 10;
          state.data.task.properties.done = Math.round((x.properties.validated + x.properties.done) * 10) / 10;
        }
        return state;
      };
    });

  const getBuildingsDataRed$ = actions.getBuildingsData$
    .map(x => {
      return function(state) {
        const geosjonFeatures = x.features.filter(feature => feature.geometry.type === 'Polygon');
        state.data.buildings = {};
        state.data.buildings.geosjon = geosjonFeatures;
        state.data.buildings.nb = geosjonFeatures.length;
        state.data.users = updateUsersData([], geosjonFeatures, 'buildings');
        return state;
      };
    });

  const getLanduseDataRed$ = actions.getLanduseData$
    .map(x => {
      return function(state) {
        let geosjonFeatures = x.features.filter(feature => feature.geometry.type === 'Polygon');
        state.data.landuse = {};
        state.data.landuse.geosjon = geosjonFeatures;
        state.data.landuse.total = calcArea(geosjonFeatures);
        geosjonFeatures = geosjonFeatures.filter(layer => layer.properties.landuse === 'residential');
        state.data.landuse.res = calcArea(geosjonFeatures);
        state.data.users = updateUsersData(state.data.users, geosjonFeatures, 'landuse');
        return state;
      };
    });

  const getHighwayDataRed$ = actions.getHighwayData$
    .map(x => {
      return function(state) {
        const geosjonFeatures = x.features.filter(feature => feature.geometry.type === 'LineString');
        state.data.highway = {};
        state.data.highway.geosjon = geosjonFeatures;
        state.data.highway.nb = geosjonFeatures.length;
        state.data.highway.dist = Math.round(geosjonFeatures.reduce((acc, curr) => acc + lineDistance(curr, 'kilometers'), 0) * 10) / 10;
        state.data.users = updateUsersData(state.data.users, geosjonFeatures, 'highway');
        return state;
      };
    });

  const getWaterwayDataRed$ = actions.getWaterwayData$
    .map(x => {
      return function(state) {
        const geosjonFeatures = x.features.filter(feature => feature.geometry.type === 'LineString');
        const stDate = moment(state.params.startDate);
        const endDate = moment(state.params.endDate);
        state.data.waterway = {};
        state.data.waterway.geosjon = geosjonFeatures;
        state.data.waterway.nb = geosjonFeatures.length;
        state.data.waterway.dist = Math.round(geosjonFeatures.reduce((acc, curr) => acc + lineDistance(curr, 'kilometers'), 0) * 10) / 10;
        state.data.users = updateUsersData(state.data.users, geosjonFeatures, 'waterway');
        state.data.users = finalizeUsersData(state.data.users);
        state.data.users.sort((user1, user2) => user1.edits < user2.edits);
        state.params.startDate = stDate.format('DD/MM/YYYY HH:mm');
        state.params.endDate = endDate.format('DD/MM/YYYY HH:mm');
        return state;
      };
    });

  return Rx.Observable.merge(
    locationStatusRed$,
    cancelProcessRed$,
    openNewDashDialogRed$,
    changeServerRed$,
    unvalidInputsRed$,
    validInputsRed$,
    getURLParamsRed$,
    getTaskDataRed$,
    getBuildingsDataRed$,
    getLanduseDataRed$,
    getHighwayDataRed$,
    getWaterwayDataRed$
    );
}

function intent(dom, locateMap) {
  const actions = {};

  // New dashboard dialog related
  const chgTaskId$ = Rx.Observable.fromEvent(dom.taskId, 'change').map(event => event.target.value).startWith('').share();
  const chgStDay$ = Rx.Observable.fromEvent(dom.stDay, 'change').map(event => event.target.value);
  const chgStMonth$ = Rx.Observable.fromEvent(dom.stMonth, 'change').map(event => event.target.value);
  const chgStYear$ = Rx.Observable.fromEvent(dom.stYear, 'change').map(event => event.target.value);
  const chgStHour$ = Rx.Observable.fromEvent(dom.stHour, 'change').map(event => event.target.value);
  const chgStMin$ = Rx.Observable.fromEvent(dom.stMin, 'change').map(event => event.target.value);
  const chgEndDay$ = Rx.Observable.fromEvent(dom.endDay, 'change').map(event => event.target.value);
  const chgEndMonth$ = Rx.Observable.fromEvent(dom.endMonth, 'change').map(event => event.target.value);
  const chgEndYear$ = Rx.Observable.fromEvent(dom.endYear, 'change').map(event => event.target.value);
  const chgEndHour$ = Rx.Observable.fromEvent(dom.endHour, 'change').map(event => event.target.value);
  const chgEndMin$ = Rx.Observable.fromEvent(dom.endMin, 'change').map(event => event.target.value);
  const chgServer$ = Rx.Observable.fromEvent(dom.server, 'change').map(event => SERVERS[event.target.value]).share();
  const submitForm$ = Rx.Observable.fromEvent(dom.submitTask, 'click').share();
  const closeNewDashDialog$ = Rx.Observable.fromEvent(dom.newTaskCloseButton, 'click');
  const closeLoadingDialog$ = Rx.Observable.fromEvent(dom.loadingCloseButton, 'click');
  const locationFound$ = Rx.Observable.fromEvent(locateMap, 'locationfound').map(ev => [ev.longitude, ev.latitude]);
  const locationError$ = Rx.Observable.fromEvent(locateMap, 'locationerror').map(() => null);

  actions.locationStatus$ = Rx.Observable.merge(
    locationFound$,
    locationError$);

  const refresh$ = Rx.Observable.fromEvent(dom.taskContainer, 'click')
    .filter(ev => ev.target.id === 'refresh')
    .map(() => window.location.href);

  const loadURL$ = Rx.Observable.fromEvent(window, 'load')
    .map(ev => ev.target.URL.replace(window.location.protocol + '//' + window.location.host, ''));

  const init$ = loadURL$
    .filter(URL => !validURLParams(URL));

  actions.cancelProcess$ = Rx.Observable.merge(closeNewDashDialog$, closeLoadingDialog$);

  const initWithParams$ = loadURL$
    .filter(validURLParams);

  actions.openNewDashDialog$ = Rx.Observable.merge(
    Rx.Observable.fromEvent(dom.taskMenuNewTask, 'click'),
    Rx.Observable.fromEvent(dom.drawerNewTask, 'click'),
    init$);

  const validCondition$ = chgServer$
    .map(server => server === 'https://overpass-api.de/api/interpreter' ? validStartAndEndDate : validStartDateOnly)
    .share();

  const changeStartDate$ = Rx.Observable.combineLatest(chgStDay$, chgStMonth$, chgStYear$, chgStHour$, chgStMin$)
    .map(data => data[0] + '/' + data[1] + '/' + data[2] + ' ' + data[3] + ':' + data[4])
    .share();

  const changeEndDate$ = Rx.Observable.combineLatest(chgEndDay$, chgEndMonth$, chgEndYear$, chgEndHour$, chgEndMin$)
    .map(data => data[0] + '/' + data[1] + '/' + data[2] + ' ' + data[3] + ':' + data[4])
    .share();

  actions.changeServer$ = chgServer$;

  actions.validInputs$ = submitForm$.withLatestFrom(chgTaskId$, changeStartDate$, changeEndDate$, chgServer$, validCondition$)
    .filter(data => data[5](data[1], data[2], data[3]))
    .map(data => {
      return {taskId: data[1], startDate: data[2], endDate: data[3], server: data[4]};
    })
    .share();

  actions.unvalidInputs$ = submitForm$.withLatestFrom(chgTaskId$, changeStartDate$, changeEndDate$, chgServer$, validCondition$)
    .filter(data => !data[5](data[1], data[2], data[3]));

  const hashChange$ = Rx.Observable.fromEvent(window, 'hashchange')
    // .map(ev => ev.newURL);
    .map(() => window.location.href);

  actions.getURLParams$ = Rx.Observable.merge(initWithParams$, hashChange$, refresh$)
    .map(URL => {
      const tmp = URL.split('/#')[1];
      const split = tmp.split('&');
      const values = split.map(param => param.split('=')[1]);
      const params = {};
      params.taskId = values[0];
      params.startDate = values[1];
      params.server = values[values.length - 1];
      if (values.length === 4) {
        params.endDate = values[2];
      }
      return params;
    })
    .share();

  const OAPIReqBuilder$ = actions.getURLParams$
    .map(params => params.server === 'https://overpass-api.de/api/interpreter' ? buildOAPIReqWithEndDate : buildOAPIReqWithoutEndDate)
    .share();

  actions.getTaskData$ = actions.getURLParams$
    .flatMap(params => Rx.Observable.fromPromise(jquery.getJSON(HOTOSM_URL + params.taskId + '.json')))
    .doOnError(displayErrorMessage.bind(this, dom.loadingProgress, dom.loadingMessage, dom.loadingCloseButton))
    .retry()
    .share();

  const calcBbox$ = actions.getTaskData$
    .filter(geojson => geojson.properties !== undefined)
    .map(mapBbox)
    .doOnError(displayErrorMessage.bind(this, dom.loadingProgress, dom.loadingMessage, dom.loadingCloseButton))
    .retry()
    .share();

  actions.getBuildingsData$ = calcBbox$.withLatestFrom(OAPIReqBuilder$, actions.getURLParams$)
    .map(data => data[1](data[2].server, data[0], 'building', data[2].startDate, data[2].endDate))
    .flatMap(url => Rx.Observable.fromPromise(jquery.get(url)))
    .map(data => osmtogeojson(data))
    .doOnError(displayErrorMessage.bind(this, dom.loadingProgress, dom.loadingMessage, dom.loadingCloseButton))
    .retry()
    .share();

  actions.getLanduseData$ = actions.getBuildingsData$.withLatestFrom(OAPIReqBuilder$, calcBbox$, actions.getURLParams$)
    .map(data => data[1](data[3].server, data[2], 'landuse', data[3].startDate, data[3].endDate))
    .flatMap(url => Rx.Observable.fromPromise(jquery.get(url)))
    .map(data => osmtogeojson(data))
    .doOnError(displayErrorMessage.bind(this, dom.loadingProgress, dom.loadingMessage, dom.loadingCloseButton))
    .retry()
    .share();

  actions.getHighwayData$ = actions.getLanduseData$.withLatestFrom(OAPIReqBuilder$, calcBbox$, actions.getURLParams$)
    .map(data => data[1](data[3].server, data[2], 'highway', data[3].startDate, data[3].endDate))
    .flatMap(url => Rx.Observable.fromPromise(jquery.get(url)))
    .map(data => osmtogeojson(data))
    .doOnError(displayErrorMessage.bind(this, dom.loadingProgress, dom.loadingMessage, dom.loadingCloseButton))
    .retry()
    .share();

  actions.getWaterwayData$ = actions.getHighwayData$.withLatestFrom(OAPIReqBuilder$, calcBbox$, actions.getURLParams$)
    .map(data => data[1](data[3].server, data[2], 'waterway', data[3].startDate, data[3].endDate))
    .flatMap(url => Rx.Observable.fromPromise(jquery.get(url)))
    .map(data => osmtogeojson(data))
    .doOnError(displayErrorMessage.bind(this, dom.loadingProgress, dom.loadingMessage, dom.loadingCloseButton))
    .retry()
    .share();

  return actions;
}

function model(actions) {
  const reducers$ = reducers(actions);
  return reducers$.scan((acc, x) => x(acc), {
    params: undefined,
    data: undefined,
    location: undefined
  });
}

function render(state$, dom, map, highwayMap, locateMap) {

  state$.subscribe(state => {
    let URL, prot, host, stDate, endDate; // eslint-disable-line one-var

    if (state.params === undefined && state.data === undefined) {
      if (dom.newTaskDialog.hasAttribute('open')) {
        dom.newTaskDialog.close();
      }
      if (dom.loadingDialog.hasAttribute('open')) {
        dom.loadingDialog.close();
      }
    } else if (state.params === null) {
      initFormValues(dom.taskId, dom.stDay, dom.stMonth, dom.stYear, dom.stHour, dom.stMin,
        dom.endDay, dom.endMonth, dom.endYear, dom.endHour, dom.endMin, dom.server, dom.newTaskMsg);
      displayDialog(dom.newTaskDialog);
      if (L.DomUtil.hasClass(dom.drawer, 'is-visible')) {
        dom.layout.MaterialLayout.toggleDrawer();
      }
    } else if (state.data === undefined) {
      handleEndDateInputs(state, dom);
    } else if (state.data === null) {
      dom.newTaskMsg.innerText = 'Incorrect / Missing values!';
    } else if (state.data.task === undefined) {
      dom.newTaskDialog.close();
      prot = window.location.protocol;
      host = window.location.host;
      stDate = moment(state.params.startDate, 'DD/MM/YYYY HH:mm').utc().format();
      endDate = moment(state.params.endDate, 'DD/MM/YYYY HH:mm').utc().format();
      if (state.params.server === 'https://overpass-api.de/api/interpreter') {
        URL = prot + '//' + host + '/#taskId=' + state.params.taskId + '&stDate=' + stDate + '&endDate=' + endDate + '&server=' + state.params.server;
      } else {
        URL = prot + '//' + host + '/#taskId=' + state.params.taskId + '&stDate=' + stDate + '&server=' + state.params.server;
      }
      if (location.href === URL) {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
      window.location.href = URL;
    } else if (state.data.task === null) {
      if (L.DomUtil.hasClass(dom.drawer, 'is-visible')) {
        dom.layout.MaterialLayout.toggleDrawer();
      }
      displayDialog(dom.loadingDialog);

      if (!L.DomUtil.hasClass(dom.loadingCloseButton, 'hide')) {
        L.DomUtil.addClass(dom.loadingCloseButton, 'hide');
        L.DomUtil.removeClass(dom.loadingProgress, 'hide');
        L.DomUtil.removeClass(dom.loadingMessage, 'loading-error');
      }
      dom.loadingMessage.innerText = 'Retrieve task data';
    } else if (state.data.task === 'error') {
      displayErrorMessage(dom.loadingProgress, dom.loadingMessage, dom.loadingCloseButton, 'invalid task');
    } else if (state.data.buildings === undefined) {
      dom.loadingMessage.innerText = 'Retrieve building data';
      dom.loadingProgress.MaterialProgress.setProgress(20);
    } else if (state.data.landuse === undefined) {
      dom.loadingMessage.innerText = 'Retrieve landuse data';
      dom.loadingProgress.MaterialProgress.setProgress(40);
    } else if (state.data.highway === undefined) {
      dom.loadingMessage.innerText = 'Retrieve highway data';
      dom.loadingProgress.MaterialProgress.setProgress(60);
    } else if (state.data.waterway === undefined) {
      dom.loadingMessage.innerText = 'Retrieve waterway data';
      dom.loadingProgress.MaterialProgress.setProgress(80);
    } else if (state.location === undefined) {
      dom.loadingMessage.innerText = 'Data successfully retrieved';
      dom.loadingProgress.MaterialProgress.setProgress(100);
      locateMap.locate({timeout: 5000});
      if (map !== null) {
        map.remove();
      }
      if (highwayMap !== null) {
        highwayMap.remove();
      }
      // console.log(JSON.stringify(state));
      dom.taskContainer.innerHTML = '';
      dom.taskContainer.innerHTML = taskTpl(state);
      addTask(dom.drawerNav, dom.drawerNewTask, dom.taskMenu, dom.newTaskItem, state);
      dom.loadingProgress.MaterialProgress.setProgress(0);
      dom.loadingDialog.close();
      map = displayOverviewMap(state);
      componentHandler.upgradeDom(); // eslint-disable-line no-undef
      displayTaskProgression(state.data.task);
    } else {
      highwayMap = displayHighwayhMap(state);
    }
  });
}

function main() {
  let map = null;
  let highwayMap = null;
  let locateMap = L.map('init-map');
  const dom = buildDom();
  const actions = intent(dom, locateMap);
  const state$ = model(actions);
  render(state$, dom, map, highwayMap, locateMap);
}

main();
