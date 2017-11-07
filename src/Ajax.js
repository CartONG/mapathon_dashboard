'use strict';

import { setProjectData, setBbox } from './Actions';
import { HOTOSM_URL, OSM_API_URL } from './Variables';

function sendXHR(url, callBack) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = callBack;
  xhr.send();
}

export function manageRequests(model, handler) {

  if(model.loading.project) {
    sendXHR(HOTOSM_URL + model.search.params.projectId + '/summary', ev => {
      const projectData = JSON.parse(ev.target.responseText);
      handler.publish('ACTIONS', setProjectData(projectData));
    });
  }

  if(model.loading.bbox) {
    sendXHR(HOTOSM_URL + model.search.params.projectId, ev => {
      const projectBbox = JSON.parse(ev.target.responseText);
      handler.publish('ACTIONS', setBbox(projectBbox));
    });
  }

  if(model.loading.changesets) {
    const b = model.search.results.bbox;
    const bbox = 'bbox=' + b.w + ',' + b.s + ',' + b.e + ',' + b.n;
    const time = 'time=' + model.search.params.startDateTime + ',' + model.search.params.endDateTime;
    const url = OSM_API_URL + 'changesets?' + bbox + '&' + time;
    sendXHR(url, ev => {
      const selector = 'tag[v*="#hotosm-project-' + model.search.params.projectId + '"]';
      const xmlDoc = new DOMParser().parseFromString(ev.target.responseText, "text/xml");
      const tagElmts = xmlDoc.querySelectorAll(selector);
      const obj = {};
      Array.from(tagElmts).map(t => obj[t.parentNode.attributes[2].value] = 0);
      const userIds = Object.keys(obj);
    });
  }
}