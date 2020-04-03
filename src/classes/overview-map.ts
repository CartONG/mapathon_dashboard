import * as L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import icon from '../../public/images/leaflet/marker-icon.png';
import iconShadow from '../../public/images/leaflet/marker-shadow.png';

import { Point } from 'geojson';

import { Layers } from './layers';
import { IFeatureName } from './feature-name-interface';
import { OSMData } from './osm-data';

// Options to create the map 
const OVERVIEW_MAP_OPTIONS = {
  layers: [L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', 
  {
    attribution: '© <a href="/copyright">OpenStreetMap contributors</a>. Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>. <a href="https://wiki.osmfoundation.org/wiki/Terms_of_Use" target="_blank">Website and API terms</a>',
    maxZoom: 19
  })]
};

//Class to define the overview map
export class OverviewMap {
  private layers: Layers;
  private map!: L.Map;
  
  constructor() {
    this.layers = new Layers();
  };

  //Function to display the map
  display(aoiCentroid: Point, osmData: OSMData)
  {
    let DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow
    });
    //Change the icon for our default one
    L.Marker.prototype.options.icon = DefaultIcon;
    //Create the map
    this.map = L.map('overview-map', OVERVIEW_MAP_OPTIONS);
    //Center the map on the area of interest centroid
    this.map.setView([aoiCentroid.coordinates[1], aoiCentroid.coordinates[0]], 10);
    //Create the layers of the map then add them to the map
    this.layers.create(osmData);
    this.layers.addTo(this.map);
  }

  //Getter for the color of the given feature
  getColor(feature: keyof IFeatureName)
  {
    return this.layers.getColor(feature);
  }

  //Function to update the map
  update(osmData: OSMData) {
    this.layers.clear();
    this.layers.create(osmData);
    this.layers.addTo(this.map);
  };
  
  //Function to change the visibility of a layer when a checkbox is clicked
  onCheckboxClicked(layerName: keyof IFeatureName, isVisible: boolean)
  {
    this.layers.setVisibility(layerName, isVisible);
  };
  
  //Function to remove the map from the DOM
  destroy()
  {
    this.map.remove();
  };
}