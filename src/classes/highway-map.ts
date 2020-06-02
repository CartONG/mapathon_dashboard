'use strict';

import * as L from 'leaflet';

import { HighwayLayers } from './highway-layers'

const attribution = ['Map tiles by <a href="https://stamen.com" target="_blank">Stamen Design</a>,',
'<a href="https://creativecommons.org/licenses/by/3.0" target="_blank">CC BY 3.0</a> <br>Map data &copy; <a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a> contributors,',
'<a href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">ODbL</a>.']

// Options of the highway map
const HIGHWAY_MAP_OPTIONS = {
  center: new Object() as L.LatLng,
  zoom: 10,
  layers: [
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}',
      {
        attribution: attribution.join(' '),
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
      } as L.TileLayerOptions
    )
  ]
};

//Class to define the highway map
export class HighwayMap {
  layers = new HighwayLayers();
  map!: L.Map;

  //Function to display the map
  display(highwaysLength: number) {
    //Define the center of the map
    HIGHWAY_MAP_OPTIONS.center = new L.LatLng(this.layers.getStartLatitude(), this.layers.getStartLongitude());
    //Create the map
    this.map = L.map('highway-map', HIGHWAY_MAP_OPTIONS);
    //Create then add the highway layers
    this.layers.create(highwaysLength);
    this.layers.addTo(this.map);
  };

  //Setter for the start position
  setStartPosition(position: Position)
  {
    this.layers.setStartPosition(position);
  }

  //Function to update the highway layer according to the length given
  update(highwaysLength: number)
  {
    this.layers.clear();
    this.layers.create(highwaysLength);
    this.layers.addTo(this.map);
  };

  //Function to remove the map from the DOM
  destroy()
  {
    this.map.remove();
  };
};