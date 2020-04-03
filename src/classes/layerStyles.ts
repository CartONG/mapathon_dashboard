import { IFeatureName } from "./feature-name-interface";

import * as L from 'leaflet'

//Styles defined for each layer
const STYLES = {
  // task: {
  //   "color": "#f9ec12",
  //   "weight": 5,
  //   "fillOpacity": 0,
  //   "opacity": 1
  // },
  building: {
    "color": "#8758f3",
    "weight": 4,
    "fillOpacity": 1,
    "opacity": 1
  },
  highway: {
    "color": "#f0782c",
    "weight": 2,
    "fillOpacity": 1,
    "opacity": 1
  },
  landuse: {
    "color": "#9ec658",
    "weight": 2,
    "fillOpacity": 1,
    "opacity": 1
  },
  waterway: {
    "color": "#58c4f2",
    "weight": 4,
    "fillOpacity": 1,
    "opacity": 1
  }
}

//Class to define the different styles according to the layer
export class LayerStyles implements IFeatureName {
  building!: L.PathOptions;
  highway!: L.PathOptions;
  landuse!: L.PathOptions;
  waterway!: L.PathOptions;

  * generator()
  {
    yield 'building'
    yield 'highway'
    yield 'landuse'
    yield 'waterway'
  }

  //Construct of the different styles
  constructor()
  {
    for(let currentFeature of this.generator())
    {
      this[currentFeature] = STYLES[currentFeature];
    }
  }
}