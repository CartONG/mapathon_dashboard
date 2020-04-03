import { IFeatureName } from './feature-name-interface'

import { FeatureCollection, GeometryObject } from 'geojson';

import * as lineDistance from '@turf/line-distance';
import area from '@turf/area';
import { AllGeoJSON } from '@turf/helpers'

//Class to manage the features geometry and messages
export class OSMData implements IFeatureName {
  building!: FeatureCollection<GeometryObject>;
  highway!: FeatureCollection<GeometryObject>;
  landuse!: FeatureCollection<GeometryObject>;
  waterway!: FeatureCollection<GeometryObject>;
  buildingMessage = '';
  highwayMessage = '';
  highwaysLength = 0;
  residentialLanduseArea = 0;
  totalLanduseArea = 0;
  waterwayMessage = ''
  waterwaysLength = 0;

  //Function to set the feature collection to the according feature and create the according message
  set(feature: keyof IFeatureName, features: FeatureCollection<GeometryObject>)
  {
    this[feature] = features;
    switch(feature)
    {
      case "highway":
      case "waterway":
        this.sumLines(feature);
        this.createMessage(feature, 'km');
        break;
      case "landuse":
        this.sumAreas(false);
        this.sumAreas(true);
        break;
      case "building":
        this.createMessage(feature, '');
        break;
    }
  }

  //Function to work out the total distance of the given feature and set the length according to the feature
  //("highway" => highwaysLength or "waterway" => waterwaysLength)
  private sumLines(feature: keyof IFeatureName) {
    let dst = 0.;
    var i;
    for (i = 0; i < this[feature].features.length; i++) {
      dst += lineDistance(this[feature].features[i], 'kilometers');
    }
    feature=="highway"?this.highwaysLength = Math.round(dst*10)/10:this.waterwaysLength = Math.round(dst*10)/10;
  }

  //Function to work out the total area and residential according to the boolean given
  //(true => residential or false => total)
  private sumAreas(isResidential: boolean) {
    let surface = 0.;
    var i;
    for( i = 0; i < this.landuse.features.length; i++){
      surface += area(this.landuse.features[i] as AllGeoJSON);
      if(isResidential && this.landuse.features[i].properties.landuse != 'residential'){
        surface -= area(this.landuse.features[i] as AllGeoJSON);
      }
    }
    surface /= 1000000;
    isResidential==true?this.residentialLanduseArea = Math.round(surface * 100) / 100:this.totalLanduseArea = Math.round(surface * 100) / 100;
  }

  //Function to create the message according to the feature given
  private createMessage(feature: keyof IFeatureName, unity: string)
  {
    let messageCreated;
    if(this[feature].features.length==0)
    {
      // Message is "No [road(for highway)/featureName(building,landuse,waterway)] created yet"
      messageCreated = "No " + (feature=="highway"?"road":feature) + " created yet";
    }
    else
    {
      if(this[feature].features.length==1)
      {
        // Message is "One "[road(for highway)/featureName(building,landuse,waterway)] created"
        messageCreated = "One " + (feature=="highway"?"road":feature) + " created";
      }
      else
      {
        // Message is "XXXX "[roads(for highway)/featureName(buildings,landuses,waterways)] created"
        messageCreated = this[feature].features.length + (feature=="highway"?" roads":" " + feature + "s") + " created"
      }

      //According to the feature, look for the distance concate with the unity
      let distance = "";
      if(feature == "highway")
      {
        distance = "(" + this.highwaysLength + unity + ")";
      }
      else if(feature == "waterway")
      {
        distance = "(" + this.waterwaysLength + unity + ")";
      }
      //Add it to the created message
      messageCreated += distance;
    }
    
    switch(feature)
    {
      case "building":
        this.buildingMessage = messageCreated;
        break;
      case "highway":
        this.highwayMessage = messageCreated;
        break;
      case "waterway":
        this.waterwayMessage = messageCreated;
        break;
    }

  }
};