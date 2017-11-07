'use strict';

export function setSearchParams(params) {
  return {
    type: 'SET_SEARCH_PARAMS',
    payload: params
  }
};

export function setProjectData(projectData) {
  return {
    type: 'SET_PROJECT_DATA',
    payload: projectData
  }
};

export function setBbox(bbox) {
  return {
    type: 'SET_BBOX',
    payload: bbox
  }
};