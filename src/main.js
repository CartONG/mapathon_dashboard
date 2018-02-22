'use strict';

import moment from 'moment';
import { init } from 'snabbdom';
import h from 'snabbdom/h';
import PubSub from './PubSub';
import App from './components/App';

const patch = init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/eventlisteners').default,
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/dataset').default,
  require('snabbdom/modules/style').default
]);

const initialState = {
  startDateTime: moment().add(-60, 'm').set('minute', 0),
  endDateTime: moment().add(1, 'h').set('minute', 0),
  project: null,
  bbox: null,
  changesets: null,
  OSMData: null,
  leaderboard: null,
};

function reduce(state, action) {

  function reset(state) {
    return state;
  }

  state = reset(state);

  switch (action.type) {
    case 'GET_OSM_DATA':
      state.project = {};
      state.project.id = action.payload.projectId;
      state.startDateTime = action.payload.startDateTime;
      state.endDateTime = action.payload.endDateTime;
      state.server = action.payload.server;
      state.bbox = null;
      state.changesets = null;
      state.OSMData = null;
      state.leaderboard = null;
      return state;
    case 'SET_PROJECT_DATA':
      Object.assign(state.project, action.payload);
      return state;
    case 'SET_BBOX':
      state.bbox = action.payload;
      return state;
    case 'SET_CHANGESETS':
      state.changesets = action.payload;
      return state;
    case 'SET_OSM_DATA':
      state.OSMData = action.payload;
      return state;
    case 'SET_LEADERBOARD':
      state.leaderboard = action.payload;
  }

  return state;
}

function main(initState, initVnode, App) {

  const update = function(msg, action) {
    state = reduce(state, action);
    newVnode = App(state);
    patch(oldVnode, newVnode);
    oldVnode = newVnode;
    console.log(state);
  }

  let newVnode = null, oldVnode = initVnode, state = initState;

  PubSub.subscribe('ACTIONS', update);
  PubSub.publish('ACTIONS', { type: 'START' });
}

main(initialState, document.querySelector('#root'), App);
