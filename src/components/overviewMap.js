'use strict';

import L from 'leaflet';
import OVMapStyles from '../styles/OVMapStyles.json'

const OV_MAP_OPTS = {
  layers: [L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
    attribution: 'Map tiles by <a href="" target="_blank">korona.geog.uni-heidelberg.de</a> <br>Map data &copy; <a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">ODbL</a>',
    maxZoom: 19
  })]
};

export function displayOverviewMap(model) {
  const map = L.map('overview-map', OV_MAP_OPTS);
  //const taskLayer = L.geoJson(state.data.task, {style: conf.STYLES.task}).addTo(map);
  L.geoJson(model.OSMData.landuse, {style: OVMapStyles.STYLES.landuse}).addTo(map);
  L.geoJson(model.OSMData.highway, {style: OVMapStyles.STYLES.highway}).addTo(map);
  L.geoJson(model.OSMData.building, {style: OVMapStyles.STYLES.building}).addTo(map);
  L.geoJson(model.OSMData.waterway, {style: OVMapStyles.STYLES.waterway}).addTo(map);
  // map.fitBounds(taskLayer.getBounds());
  map.setView([model.project.aoiCentroid.coordinates[1], model.project.aoiCentroid.coordinates[0]], 10);
  return map;
}
