'use strict';

export function getOSMData(params) {
  return {
    type: 'GET_OSM_DATA',
    payload: params
  }
};

export function setProjectData(projectData) {
  return {
    type: 'SET_PROJECT_DATA',
    payload: projectData
  }
};

export function setBBox(bbox) {
  return {
    type: 'SET_BBOX',
    payload: bbox
  }
};

export function setChangesets(changesets) {
  return {
    type: 'SET_CHANGESETS',
    payload: changesets
  }
};

export function setOsmDataAndLeaderboard(data) {
  return {
    type: 'SET_OSM_DATA_AND_LEADERBOARD',
    payload: data
  }
};

export function updateChangesetsAndOsmData(data) {
  return {
    type: 'UPDATE_CHANGESETS_AND_OSM_DATA',
    payload: data
  }
};

export function setError(data) {
  return {
    type: 'SET_ERROR',
    payload: data
  }
};