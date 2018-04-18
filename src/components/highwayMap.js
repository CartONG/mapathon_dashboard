'use strict';

import L from 'leaflet';
import {point, lineString} from '@turf/helpers';
import destination from '@turf/destination';

export const HW_MAP_DEPT_OPTS = {
  radius: 7,
  fill: true,
  fillColor: '#1a9641',
  fillOpacity: 1,
  stroke: true,
  weight: 2,
  color: '#ffffff'
};

export const HW_MAP_END_OPTS = {
  radius: 7,
  fill: true,
  fillColor: '#d7191c',
  fillOpacity: 1,
  stroke: true,
  weight: 2,
  color: '#ffffff'
};

export const HW_LINE_OPTS = {
  weight: 5,
  opacity: 0.5
};

const HW_MAP_OPTS = {
  center: null,
  zoom: 10,
  layers: [L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com" target="_blank">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0" target="_blank">CC BY 3.0</a> <br>Map data &copy; <a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">ODbL</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'})]
};

export function displayHighwayMap(dist, startLatitude, startLongitude) {
  const start =  point([startLongitude, startLatitude]);
  const end = destination(start, dist, 90);
  const startLayer = L.circleMarker([start.geometry.coordinates[1], start.geometry.coordinates[0]], HW_MAP_DEPT_OPTS);
  const endLayer = L.circleMarker([end.geometry.coordinates[1], end.geometry.coordinates[0]], HW_MAP_END_OPTS);
  const line = lineString([start.geometry.coordinates, end.geometry.coordinates]);
  const lineLayer = L.geoJson(line, HW_LINE_OPTS);
  const layers = dist > 1 ? [lineLayer, startLayer, endLayer] : [];
  HW_MAP_OPTS.center = [startLatitude, startLongitude];
  const highwayMap = layers.reduce((map, layer) =>map.addLayer(layer), L.map('highway-map', HW_MAP_OPTS));
  highwayMap.fitBounds(lineLayer.getBounds(), {padding: [16, 16], maxZoom: 18});
  return highwayMap;
}