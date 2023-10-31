"use strict";

import * as L from "leaflet";

import { HighwayLayers } from "./highway-layers";

const attribution = [
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ',
  'Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
  'hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
];

// Options of the highway map
const HIGHWAY_MAP_OPTIONS = {
  center: {} as L.LatLng,
  zoom: 10,
  layers: [
    L.tileLayer(
      "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.{ext}",
      {
        attribution: attribution.join(" "),
        subdomains: "abcd",
        minZoom: 0,
        maxZoom: 20,
        ext: "png",
      } as L.TileLayerOptions
    ),
  ],
};

//Class to define the highway map
export class HighwayMap {
  layers = new HighwayLayers();
  map!: L.Map;

  //Function to display the map
  display(highwaysLength: number) {
    //Define the center of the map
    HIGHWAY_MAP_OPTIONS.center = new L.LatLng(
      this.layers.getStartLatitude(),
      this.layers.getStartLongitude()
    );
    //Create the map
    this.map = L.map("highway-map", HIGHWAY_MAP_OPTIONS);
    //Create then add the highway layers
    this.layers.create(highwaysLength);
    this.layers.addTo(this.map);
  }

  //Setter for the start position
  setStartPosition(position: GeolocationPosition) {
    this.layers.setStartPosition(position);
  }

  //Function to update the highway layer according to the length given
  update(highwaysLength: number) {
    this.layers.clear();
    this.layers.create(highwaysLength);
    this.layers.addTo(this.map);
  }

  //Function to remove the map from the DOM
  destroy() {
    this.map.remove();
  }
}
