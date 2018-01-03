'use strict';

import h from 'snabbdom/h';
import { header, searchBar } from './layout';
import { getProjectData, getBBox, getChangesets, getOSMBuildings } from '../Ajax';

export default function App(model) {
  const layout = h('div#app', [
    header(),
    searchBar(model)
  ]);

  if(model.project && !model.project.name) {
    getProjectData(model.project.id);
    return layout;
  }

  if(model.project && model.project.name && !model.bbox) {
    getBBox(model.project.id);
    return layout;  
  }

  if(model.bbox && !model.changesets) {
    getChangesets(model.bbox, model.startDateTime, model.endDateTime, model.project.id);
    return layout;  
  }

  if(model.changesets && !model.OSMData) {
    getOSMBuildings(model.bbox, model.startDateTime, model.endDateTime, model.server, model.changesets);
    return layout;
  }

  return layout; 
}