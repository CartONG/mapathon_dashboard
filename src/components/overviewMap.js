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

const overviewValues = {
  checkboxes: {},
  layers: {},
  map: null
};

function getStyle(layerOpacity)
{
  return {
    opacity: layerOpacity,
    fillOpacity: layerOpacity
  };
};

function invisibleStyle(feature)
{
  return getStyle(0);
}

function removeLayers()
{
  for(let layerName in overviewValues.layers) {
    overviewValues.layers[layerName].clearLayers();
  }
};

function createLayers(OSMData) {
  for(let layerName in overviewValues.layers) {
    overviewValues.layers[layerName] = L.geoJson(OSMData[layerName], {style: OVMapStyles.STYLES[layerName]});
    if(overviewValues.checkboxes[layerName] === false)
    {
      overviewValues.layers[layerName].setStyle(invisibleStyle);
    }
  }
};

function addLayers() {
  for(let layerName in overviewValues.layers) {
    overviewValues.layers[layerName].addTo(overviewValues.map);
  }
};

export function displayOverviewMap(model) {
  let DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow
  });

  for(let currentCheckboxName in model.checkboxNames) {
    overviewValues.checkboxes[model.checkboxNames[currentCheckboxName]] = true;
    overviewValues.layers[model.checkboxNames[currentCheckboxName]] = null;
  }

  L.Marker.prototype.options.icon = DefaultIcon;
  overviewValues.map = L.map('overview-map', OV_MAP_OPTS);
  createLayers(model.OSMData);
  addLayers(overviewValues.map);
  overviewValues.map.setView([model.project.aoiCentroid.coordinates[1], model.project.aoiCentroid.coordinates[0]], 10);
};

export function updateOverviewMap(OSMData) {
  removeLayers();
  createLayers(OSMData);
  addLayers();
};

export function onCheckboxClicked(event)
{
  if(event.currentTarget.checked)
  {
    overviewValues.layers[event.currentTarget.name].setStyle(function (feature)
    {
      return getStyle(1);
    });
  }
  else
  {
    overviewValues.layers[event.currentTarget.name].setStyle(invisibleStyle);
  }
  overviewValues.checkboxes[event.currentTarget.name] = event.currentTarget.checked;
};

export function destroyOverviewMap()
{
  overviewValues.map.remove();
};