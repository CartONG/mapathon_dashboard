import moment from "moment";

import {
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Point,
} from "geojson";
import { GeoJSON } from "leaflet";

import { MyLatLngBounds } from "./classes/my-lat-lng-bounds";

import { FeatureName } from "./classes/feature-name-interface";

import { QueryProject } from "./query-project";

import { CONSTANTS } from "./constants";

import { ERRORS } from "./errors";

import { State } from "./classes/state";

import { FeaturesData } from "./classes/features-data";

//Constant to expose and manage the store
//It could be seen as a static class
export const store = {
  constants: CONSTANTS,
  errors: ERRORS,
  state: new State(),
  emptyLoadingMessage() {
    this.state.loadingMessage = "";
  },
  emptyErrorMessage() {
    this.state.errorMessage = "";
  },
  destroyHighwayMap() {
    this.state.highwayMap.destroy();
  },
  destroyOverviewMap() {
    this.state.overviewMap.destroy();
  },
  displayHighwayMap(currentPosition?: Position) {
    if (currentPosition) {
      this.state.highwayMap.setStartPosition(currentPosition);
    }
    this.state.highwayMap.display(
      this.state.featuresInformations.highwaysLength
    );
  },
  displayOverviewMap() {
    this.state.overviewMap.display(
      this.state.aoiCentroid,
      this.state.featuresInformations.featuresData
    );
  },
  initializeTheme() {
    if (this.state.isThemeDark) {
      document.body.classList.add("body-container--dark-theme");
    }
  },
  resetProjectLoaded() {
    this.state.projectLoaded = false;
    this.state.checkboxes.reset();
  },
  setChangeSets(changeSetsIds: string[]) {
    //Store the changesets ids when they are filtered (the filtered function only keeps unique value)
    this.state.changeSetsIds = changeSetsIds.filter(
      (value, index, self) => self.indexOf(value) === index
    );
  },
  setCheckBoxValue(checkbox: keyof FeatureName) {
    this.state.checkboxes.update(checkbox);
    // Update the overview map to display/hide the feature layer
    this.state.overviewMap.onCheckboxClicked(checkbox);
  },
  setErrorMessage(error: string) {
    this.state.errorMessage = error;
  },
  setLoadingMessage(loadingMessage: string) {
    this.state.loadingMessage = loadingMessage;
  },
  setFeatureCollection(
    feature: keyof FeatureName,
    featureCollection: FeatureCollection<Geometry, GeoJsonProperties>
  ) {
    this.state.featuresInformations.setFeatureCollection(
      feature,
      featureCollection
    );
    this.state.leaderboard.setFeatureCollection(feature, featureCollection);
  },
  setFeaturesData(featuresData: FeaturesData) {
    // Update the features for the given feature type
    store.state.featuresInformations.setFeaturesData(featuresData);
    // Update the leaderboard for the given feature type
    store.state.leaderboard.setFeaturesData(featuresData);
  },
  setProjectNameCentroidAndPercentages(
    projectName: string,
    percentMapped: number,
    percentValidated: number,
    aoiCentroid: Point
  ) {
    this.state.projectName = projectName;
    this.state.aoiCentroid = aoiCentroid;
    this.state.percentMapped = percentMapped;
    this.state.percentValidated = percentValidated;
  },
  setProjectBoundingBox(areaOfInterest: MultiPolygon) {
    this.state.boundingBox = new MyLatLngBounds(
      new GeoJSON(areaOfInterest).getBounds()
    );
  },
  setSearchBarValues(
    projectId: number,
    chosenServerURL: string,
    chosenTaskingManager: string
  ) {
    this.state.projectId = projectId;
    this.state.chosenServerURL = chosenServerURL;
    this.state.chosenTaskingManager = chosenTaskingManager;
    //Check if a timeout already exists
    if (this.state.timeoutId != -1) {
      //Clear the timeout
      window.clearTimeout(this.state?.timeoutId);
    }
    this.state.timeoutId = -1;
    //Request for project data
    QueryProject.requestProjectData();
  },
  updateTheme(isDark: boolean) {
    //Update the current theme
    let theme;
    if (isDark) {
      theme = "black";
      document.body.classList.add("body-container--dark-theme");
    } else {
      theme = "light";
      document.body.classList.remove("body-container--dark-theme");
    }
    localStorage.setItem("theme", theme);
  },
  updateProjectLoaded() {
    const refreshData = () => {
      this.state.timeoutId = -1;
      //Check if the end date time given is not passed yet
      if (
        this.state.endDateTime.diff(this.state.updateTime, "seconds", true) < 0
      ) {
        this.setErrorMessage(this.errors.UPDATIME_PASSED);
        //Launch a timer to refresh project data, and check if the end date time has changed
        this.state.timeoutId = window.setTimeout(
          refreshData,
          this.state.refreshDelay
        );
      } else {
        //Refresh the current project data
        QueryProject.refreshProjectData();
        //Update maps with the new features found
        this.state.overviewMap.update(
          this.state.featuresInformations.featuresData
        );
        this.state.highwayMap.update(
          this.state.featuresInformations.highwaysLength
        );
      }
    };
    this.state.projectLoaded = true;
    //Change the updatime for the current time
    this.state.updateTime = moment();
    //Check if a timeout already exists
    if (this.state.timeoutId != -1) {
      //Clear the timeout
      window.clearTimeout(this.state?.timeoutId);
    }
    //Create a timeout to refresh data
    this.state.timeoutId = window.setTimeout(
      refreshData,
      this.state.refreshDelay
    );
  },
};
