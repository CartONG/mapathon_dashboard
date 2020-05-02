import * as L from 'leaflet'

import { IFeatureName, generator } from './feature-name-interface'

import { store } from '../store'
import { FeaturesData } from './features-data';
import { LayerStyles } from './layerStyles';

//Class to manage layers of the overview map
export class Layers implements IFeatureName {
  building!: L.GeoJSON;
  highway!: L.GeoJSON;
  landuse!: L.GeoJSON;
  waterway!: L.GeoJSON;
  styles: LayerStyles;
  map!: L.Map;

  constructor()
  {
    this.styles = new LayerStyles();
  }

  //Function to add layers to the given map
  addTo(map: L.Map)
  {
    this.map = map;
    for(let currentLayer of generator())
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
    for(let currentLayer of generator())
    {
      this[currentLayer].clearLayers();
    }
  }

  //Function to create the layers for each property
  create(featuresData: FeaturesData)
  {
    for(let currentLayer of generator())
    {
      this[currentLayer] = L.geoJSON(featuresData[currentLayer], {style: this.styles[currentLayer]});
    }
  }

  //Getter for the color of the given feature
  getColor(feature: keyof IFeatureName): string
  {
    return this.styles[feature].color!;
  }

  //Update the visibility of the layer name given
  updateVisibility(layerName: keyof IFeatureName)
  {
    switch(this.map.hasLayer(this[layerName]))
    {
      case true:
        this[layerName].remove();
        break;
      case false:
        this[layerName].addTo(this.map);
        break;
    }
  }
}