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

export function setOsmData(data) {
  return {
    type: 'SET_OSM_DATA',
    payload: data
  }
};

export function setLeaderboard(data) {
  return {
    type: 'SET_LEADERBOARD',
    payload: data
  }
};