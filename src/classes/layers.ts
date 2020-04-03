import * as L from 'leaflet'

import { IFeatureName } from './feature-name-interface'

import { store } from '../store'
import { OSMData } from './osm-data';
import { LayerStyles } from './layerStyles';

//Class to manage layers of the overview map
export class Layers implements IFeatureName {
  building!: L.GeoJSON;
  highway!: L.GeoJSON;
  landuse!: L.GeoJSON;
  waterway!: L.GeoJSON;
  styles: LayerStyles;
  map!: L.Map;

  * generator()
  {
    yield 'building'
    yield 'highway'
    yield 'landuse'
    yield 'waterway'
  }

  constructor()
  {
    this.styles = new LayerStyles();
  }

  //Function to add layers to the given map
  addTo(map: L.Map)
  {
    this.map = map;
    for(let currentLayer of this.generator())
    {
      //Add the current layer only if the checkbox is checked
      if(store.state.checkboxes[currentLayer] === true)
      {
        this[currentLayer].addTo(map);
      }
    }
  }

  //Function to clear all the layers for each property layer
  clear()
  {
    for(let currentLayer of this.generator())
    {
      this[currentLayer].clearLayers();
    }
  }

  //Function to create the layers for each property
  create(osmData: OSMData)
  {
    for(let currentLayer of this.generator())
    {
      this[currentLayer] = L.geoJSON(osmData[currentLayer], {style: this.styles[currentLayer]});
    }
  }

  //Getter for the color of the given feature
  getColor(feature: keyof IFeatureName): string
  {
    return this.styles[feature].color!;
  }

  //Setter for the visibility of the layer name given
  setVisibility(layerName: keyof IFeatureName, isVisible: boolean)
  {
    switch(isVisible)
    {
      case false:
        this[layerName].remove();
        break;
      case true:
        this[layerName].addTo(this.map);
        break;
    }
  }
}