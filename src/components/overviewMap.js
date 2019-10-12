'use strict';

import L from 'leaflet';
import OVMapStyles from '../styles/OVMapStyles.json'
import icon from '../../public/images/leaflet/marker-icon.png';
import iconShadow from '../../public/images/leaflet/marker-shadow.png';

const OV_MAP_OPTS = {
  layers: [L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '© <a href="/copyright">OpenStreetMap contributors</a>. Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>. <a href="https://wiki.osmfoundation.org/wiki/Terms_of_Use" target="_blank">Website and API terms</a>',
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