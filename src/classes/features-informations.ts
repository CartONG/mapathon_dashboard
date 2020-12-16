import { FeatureName } from "./feature-name-interface";

import { FeaturesData } from "./features-data";

import { FeatureCollection, Geometry } from "geojson";

import lineDistance from "@turf/line-distance";
import area from "@turf/area";
import { generator } from "./feature-name-interface";

// TODO Changer les messages lors du chargement des données
// ainsi l'interface est affichée, mais les données apparaissent après

// TODO Changer les messages lors du chargement des données
// ainsi l'interface est affichée, mais les données apparaissent après

//Class to manage the features geometry and messages
export class FeaturesInformations {
  featuresData: FeaturesData;
  buildingMessage = "";
  highwayMessage = "";
  highwaysLength = 0;
  residentialLanduseArea = 0;
  totalLanduseArea = 0;
  waterwayMessage = "";
  waterwaysLength = 0;

  constructor() {
    this.featuresData = new FeaturesData();
  }

  setFeatureCollection(
    featureName: keyof FeatureName,
    featureCollection: FeatureCollection<Geometry>
  ) {
    this.featuresData.setFeatureCollection(featureName, featureCollection);
    this.createFeatureMessage(featureName);
  }

  //Function to set the features data and create messages for each feature
  setFeaturesData(featuresData: FeaturesData) {
    for (const currentFeature of generator()) {
      this.featuresData.setFeatureCollection(
        currentFeature,
        featuresData[currentFeature]
      );
      if (featuresData[currentFeature] != undefined) {
        this.createFeatureMessage(currentFeature);
      }
    }
  }

  private createFeatureMessage(feature: keyof FeatureName) {
    switch (feature) {
      case "highway":
      case "waterway":
        this.sumLines(feature);
        this.createMessage(feature, "km");
        break;
      case "landuse":
        this.sumAreas(false);
        this.sumAreas(true);
        break;
      case "building":
        this.createMessage(feature, "");
        break;
    }
  }

  //Function to work out the total distance of the given feature and set the length according to the feature
  //("highway" => highwaysLength or "waterway" => waterwaysLength)
  private sumLines(feature: keyof FeatureName) {
    let dst = 0;
    let i;
    for (i = 0; i < this.featuresData[feature].features.length; i++) {
      dst += lineDistance(this.featuresData[feature].features[i], "kilometers");
    }
    feature == "highway"
      ? (this.highwaysLength = Math.round(dst * 10) / 10)
      : (this.waterwaysLength = Math.round(dst * 10) / 10);
  }

  //Function to work out the total area and residential according to the boolean given
  //(true => residential or false => total)
  private sumAreas(isResidential: boolean) {
    let surface = 0;
    let i;
    for (i = 0; i < this.featuresData.landuse.features.length; i++) {
      surface += area(this.featuresData.landuse.features[i]);
      if (
        isResidential &&
        this.featuresData.landuse.features[i].properties?.landuse !=
          "residential"
      ) {
        surface -= area(this.featuresData.landuse.features[i]);
      }
    }
    surface /= 1000000;
    isResidential == true
      ? (this.residentialLanduseArea = Math.round(surface * 100) / 100)
      : (this.totalLanduseArea = Math.round(surface * 100) / 100);
  }

  //Function to create the message according to the feature given
  private createMessage(feature: keyof FeatureName, unity: string) {
    let messageCreated;
    if (this.featuresData[feature].features.length == 0) {
      // Message is "No [road(for highway)/featureName(building,landuse,waterway)] created yet"
      messageCreated =
        "No " + (feature == "highway" ? "road" : feature) + " created yet";
    } else {
      if (this.featuresData[feature].features.length == 1) {
        // Message is "One "[road(for highway)/featureName(building,landuse,waterway)] created"
        messageCreated =
          "One " + (feature == "highway" ? "road" : feature) + " created";
      } else {
        // Message is "XXXX "[roads(for highway)/featureName(buildings,landuses,waterways)] created"
        messageCreated =
          this.featuresData[feature].features.length +
          (feature == "highway" ? " roads" : " " + feature + "s") +
          " created";
      }

      //According to the feature, look for the distance concate with the unity
      let distance = "";
      if (feature == "highway") {
        distance = "(" + this.highwaysLength + unity + ")";
      } else if (feature == "waterway") {
        distance = "(" + this.waterwaysLength + unity + ")";
      }
      //Add it to the created message
      messageCreated += distance;
    }

    switch (feature) {
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
}
