'use strict';

import h from 'snabbdom/h';
import { header, searchBar, taskHeader, taskData, taskLeaderboard, taskProgress } from './layout';
import { getProjectData, getBBox, getChangesets, getOSMBuildings } from '../Ajax';
import { computeLeaderboard } from '../Leaderboard';

import 'leaflet/dist/leaflet.css';

export default function App(model) {
  if(model.project && !model.project.name) {
    model.loadingMessage = "Retrieving project data...";
    getProjectData(model.project.id);
  }

  if(model.project && model.project.name && !model.bbox) {
    model.loadingMessage = "Retrieving project bounding box...";
    getBBox(model.project.id);
  }

  if(model.bbox && !model.changesets) {
    model.loadingMessage = "Retrieving project modifications...";
    getChangesets(model.bbox, model.startDateTime, model.endDateTime, model.project.id);
  }

  if(model.changesets && !model.OSMData) {
    model.loadingMessage = "Retrieving project features (building, landuse, highway and waterway)...";
    getOSMBuildings(model.bbox, model.startDateTime, model.endDateTime, model.server, model.changesets);
  }

  if(model.OSMData && !model.leaderboard){
    model.loadingMessage = "Computing data...";
    model.leaderboard = computeLeaderboard(model.OSMData);
  }
  const layout = createLayout(model);

  return layout;
}

function createLayout(model)
{
  var layout = null;
  if(model.leaderboard){
    layout = h('div#app', [
      header(),
      searchBar(model),
      h('div#task',[
        taskHeader(model),
        taskData(model),
        taskLeaderboard(model)
      ])
    ]);
  }else if(model.project)
  {
    layout = h('div#app', [
      header(),
      searchBar(model),
      h('div#task', [
        taskProgress(model)
      ])
    ]);
  }
  else
  {
    layout = h('div#app', [
      header(),
      searchBar(model),
      h('div#task', {})
    ]);
  }
  return layout;
}
