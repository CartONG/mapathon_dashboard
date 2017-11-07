'use strict';

import { init } from 'snabbdom';
import h from 'snabbdom/h';
import { GeoJSON } from 'leaflet';
import PubSub from './PubSub';
import App from './components/App';
import { manageRequests } from './Ajax';

const patch = init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/eventlisteners').default,
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/dataset').default,
  require('snabbdom/modules/style').default
]);

const initialState = {
  loading: {
    project: false,
    bbox: false,
    changesets: false,
    message: null
  },
  search: {
    params: {},
    results: {}  
  }
};

function reduce(state, action) {

  function reset(state) {
    return state;
  }

  state = reset(state);

  switch (action.type) {
    case 'SET_PROJECT_DATA':
      state.search.results.project = action.payload;
      state.loading.project = false;
      state.loading.bbox = true;
      state.loading.message = 'Load BBox data ...';
      return state;
    case 'SET_BBOX':
      const b = new GeoJSON(action.payload.areaOfInterest).getBounds();
      state.search.results.bbox = { w: b.getWest(), s: b.getSouth(), e: b.getEast(), n: b.getNorth() };  
      state.loading.bbox = false;
      state.loading.changesets = true;
      state.loading.message = 'Load changesets ...'
      return state;
    case 'SET_SEARCH_PARAMS':
      state.search.params.projectId = action.payload.projectId;
      state.search.params.startDateTime = action.payload.startDateTime;
      state.search.params.endDateTime = action.payload.endDateTime;
      state.search.params.server = action.payload.server;
      state.loading.project = true;
      state.loading.message = 'Load project data ...';
      return state;
  }

  return state;
}

function main(initState, initVnode, App) {

  const update = function(msg, action) {
    state = reduce(state, action);
    manageRequests(state, PubSub);
    newVnode = App.view(state, PubSub);
    patch(oldVnode, newVnode);
    oldVnode = newVnode;
  }

  let newVnode = null, oldVnode = initVnode, state = initState;

  PubSub.subscribe('ACTIONS', update);
  PubSub.publish('ACTIONS', { type: 'START' });
}

main(initialState, document.querySelector('#root'), App);