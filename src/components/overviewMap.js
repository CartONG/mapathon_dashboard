'use strict';

import L from 'leaflet';
import OVMapStyles from '../styles/OVMapStyles.json'
import icon from '../../public/images/leaflet/marker-icon.png';
import iconShadow from '../../public/images/leaflet/marker-shadow.png';

const OV_MAP_OPTS = {
  layers: [L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
    attribution: 'Map tiles by <a href="" target="_blank">korona.geog.uni-heidelberg.de</a> <br>Map data &copy; <a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">ODbL</a>',
    maxZoom: 19
  })]
};

const layers = {
  landuse: null,
  highway: null,
  building: null,
  waterway: null
};

function removeLayers()
{
  for(let layer in layers) {
    layers[layer].clearLayers();
  }
};

function createLayers(OSMData) {
  for(let layer in layers) {
    layers[layer] = L.geoJson(OSMData[layer], {style: OVMapStyles.STYLES[layer]});
  }
};

function addLayers(map) {
  for(let layer in layers) {
    layers[layer].addTo(map);
  }
};

export function displayOverviewMap(model) {
  let DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow
  });

  L.Marker.prototype.options.icon = DefaultIcon;
  const map = L.map('overview-map', OV_MAP_OPTS);
  createLayers(model.OSMData);
  addLayers(map);
  map.setView([model.project.aoiCentroid.coordinates[1], model.project.aoiCentroid.coordinates[0]], 10);
  return map;
};

export function updateOverviewMap(map, OSMData) {
  removeLayers();
  createLayers(OSMData);
  addLayers(map);
};