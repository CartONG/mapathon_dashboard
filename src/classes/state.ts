import { Checkboxes } from "./checkboxes";

import moment from "moment";

import { Point } from "geojson";

import { MyLatLngBounds } from "./my-lat-lng-bounds";

import { FeaturesInformations } from "./features-informations";

import { OverviewMap } from "./overview-map";

import { HighwayMap } from "./highway-map";
import { Leaderboard } from "./leaderboard";

//State class which keeps the current state of the application
export class State {
  //SearchBarValues
  projectId: number;
  currentTimeZone: string;
  endDateTime: moment.Moment;
  startDateTime: moment.Moment;
  chosenTaskingManager: string;
  chosenServerURL: string;
  //ProjectDataValues
  projectLoaded: boolean;
  aoiCentroid!: Point;
  boundingBox!: MyLatLngBounds;
  changeSetsIds!: string[];
  percentMapped!: number;
  percentValidated!: number;
  projectName: string;
  updateTime!: moment.Moment;
  featuresInformations: FeaturesInformations;
  leaderboard: Leaderboard;
  //CheckboxesValues
  checkboxes: Checkboxes;
  //Information messages
  errorMessage: string;
  loadingMessage: string;
  //Maps informations
  askedLocation: boolean;
  highwayMap: HighwayMap;
  overviewMap: OverviewMap;
  //Refresh informations
  refreshDelay: number;
  timeoutId!: number;
  //Theme information
  isThemeDark: boolean;

  constructor() {
    this.projectId = 0;
    this.currentTimeZone = this.timezone();
    this.startDateTime = moment().add(-60, "m").set("minute", 0);
    this.endDateTime = moment().add(1, "h").set("minute", 0);
    this.chosenServerURL = "";
    this.chosenTaskingManager = "";
    this.loadingMessage = "";
    this.projectName = "";
    this.errorMessage = "";
    this.updateTime = moment();
    this.featuresInformations = new FeaturesInformations();
    this.leaderboard = new Leaderboard();
    this.projectLoaded = false;
    this.checkboxes = new Checkboxes();
    this.askedLocation = false;
    this.highwayMap = new HighwayMap();
    this.overviewMap = new OverviewMap();
    this.refreshDelay = 5 * 60 * 1000;
    this.timeoutId = -1;
    this.isThemeDark = this.getBooleanTheme();
  }

  private timezone(): string {
    let valueToReturn = "UTC";
    let utcOffset = moment.utc().toDate().getTimezoneOffset();

    if (utcOffset < 0) {
      valueToReturn += "+";
      utcOffset *= -1;
    } else {
      valueToReturn += "-";
    }

    const minutes = utcOffset % 60;

    valueToReturn += Math.round(utcOffset / 60);
    if (minutes !== 0) {
      valueToReturn += ":" + minutes;
    }

    return valueToReturn;
  }

  private getBooleanTheme() {
    const theme = localStorage.getItem("theme");
    return theme == "black";
  }
}
