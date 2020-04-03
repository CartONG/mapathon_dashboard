import {point, lineString, Feature, Point } from '@turf/helpers';
import destination from '@turf/destination';

import * as L from 'leaflet';

//Options for the start point
const HIGHWAY_MAP_START_OPTIONS = {
  radius: 7,
  fill: true,
  fillColor: '#1a9641',
  fillOpacity: 1,
  stroke: true,
  weight: 2,
  color: '#ffffff'
};

//Options for the end point
const HIGHWAY_MAP_END_OPTIONS = {
  radius: 7,
  fill: true,
  fillColor: '#d7191c',
  fillOpacity: 1,
  stroke: true,
  weight: 2,
  color: '#ffffff'
};

//Class for the highway map
export class HighwayLayers {
  lineLayer!: L.GeoJSON;
  //Position of CartONG
  startLongitude = 5.9215;
  startLatitude = 45.58789

  //Function to define the line layer style
  getStyle()
  {
    return {
      weight: 5,
      opacity: 0.5
    }
  };

  //Function to add the current line layer(and markers attached to) to the given map
  addTo(map: L.Map)
  {
    this.lineLayer.addTo(map);
    //Center the map on the line layer
    map.fitBounds(this.lineLayer.getBounds(), {padding: [16, 16], maxZoom: 18})
  }

  //Create the markers and line
  create(highwaysLength: number)
  {
    //Create the start point of the line(according to the location provided)
    let startPoint = point([this.startLongitude,this.startLatitude]);
    //Look for the end point of the line(according to the kilometers of roads created)
    const end = destination(startPoint, highwaysLength, 90);
    //Create the markers
    const startMarker = L.circleMarker([startPoint.geometry!.coordinates[1], startPoint.geometry!.coordinates[0]], HIGHWAY_MAP_START_OPTIONS);
    const endMarker = L.circleMarker([end.geometry!.coordinates[1], end.geometry!.coordinates[0]], HIGHWAY_MAP_END_OPTIONS);
    //Create the line
    const line = lineString([startPoint.geometry!.coordinates, end.geometry!.coordinates]);
    this.lineLayer = L.geoJSON(line, { style: this.getStyle() });
    //Add markers to the line layer
    this.lineLayer.addLayer(startMarker).addLayer(endMarker);
  }

  getStartLongitude(): number
  {
    return this.startLongitude;
  }

  getStartLatitude(): number
  {
    return this.startLatitude;
  }

  setStartPosition(position: Position)
  {
    this.startLatitude = position.coords.latitude;
    this.startLongitude = position.coords.longitude;
  }

  clear()
  {
    this.lineLayer.clearLayers();
  }
}