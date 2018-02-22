'use strict';

import h from 'snabbdom/h';
import { header, searchBar, taskHeader, taskData, taskLeaderboard } from './layout';
import { getProjectData, getBBox, getChangesets, getOSMBuildings } from '../Ajax';
import { computeLeaderboard } from '../Leaderboard';

import 'leaflet/dist/leaflet.css';

export default function App(model) {
  const layout = createLayout(model);

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

  if(model.OSMData && !model.leaderboard){
    computeLeaderboard(model.OSMData);
    return layout;
  }

  return layout;
}

function createLayout(model)
{
  var layout = null;
  if(model.OSMData)
  {
    layout = h('div#app', [
      header(),
      searchBar(model),
      h('div#task',[
        taskHeader(model),
        taskData(model),
        taskLeaderboard(model)
      ])
    ]);
  }
  else
  {
    layout = h('div#app', [
      header(),
      searchBar(model),
      h('div#task', {}
      )
    ]);
  }
  return layout;
}
