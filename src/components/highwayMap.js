'use strict';

import L from 'leaflet';
import {point, lineString} from '@turf/helpers';
import destination from '@turf/destination';

const HW_MAP_DEPT_OPTS = {
  radius: 7,
  fill: true,
  fillColor: '#1a9641',
  fillOpacity: 1,
  stroke: true,
  weight: 2,
  color: '#ffffff'
};

const HW_MAP_END_OPTS = {
  radius: 7,
  fill: true,
  fillColor: '#d7191c',
  fillOpacity: 1,
  stroke: true,
  weight: 2,
  color: '#ffffff'
};

const HW_LINE_OPTS = {
  weight: 5,
  opacity: 0.5
};

const HW_MAP_OPTS = {
  center: null,
  zoom: 10,
  layers: [
    L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}',
      {
        attribution: 'Map tiles by <a href="http://stamen.com" target="_blank">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0" target="_blank">CC BY 3.0</a> <br>Map data &copy; <a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">ODbL</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
      }
    )
  ]
};

const highwayValues =
{
  layers:
  {
    endMarker:null,
    lineLayer: null,
    startMarker: null
  },
  map: null,
  previousDist: null,
  startPoint: null
};

function createLayers(dist) {
  highwayValues.previousDist = dist;
  const end = destination(highwayValues.startPoint, dist, 90);
  highwayValues.layers.startMarker = L.circleMarker([highwayValues.startPoint.geometry.coordinates[1], highwayValues.startPoint.geometry.coordinates[0]], HW_MAP_DEPT_OPTS);
  highwayValues.layers.endMarker = L.circleMarker([end.geometry.coordinates[1], end.geometry.coordinates[0]], HW_MAP_END_OPTS);
  const line = lineString([highwayValues.startPoint.geometry.coordinates, end.geometry.coordinates]);
  highwayValues.layers.lineLayer = L.geoJson(line, HW_LINE_OPTS);
};

function addLayers() {
  for(let layer in highwayValues.layers) {
    highwayValues.layers[layer].addTo(highwayValues.map);
  }
  highwayValues.map.fitBounds(highwayValues.layers.lineLayer.getBounds(), {padding: [16, 16], maxZoom: 18});
};

function removeLayers() {
  for(let layer in highwayValues.layers) {
    highwayValues.layers[layer].remove();
  }
};

export function displayHighwayMap(dist, startLatitude, startLongitude) {
  highwayValues.startPoint = point([startLongitude, startLatitude]);
  HW_MAP_OPTS.center = [startLatitude, startLongitude];
  highwayValues.map = L.map('highway-map', HW_MAP_OPTS);
  createLayers(dist);
  addLayers();
};

export function updateHighwayMap(dist)
{
  if(highwayValues.previousDist>1)
  {
    removeLayers();
  }
  createLayers(dist);
  if(dist>1)
  {
    addLayers();
  }
};

export function destroyHighwayMap()
{
  highwayValues.map.remove();
};