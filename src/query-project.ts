import { store } from "./store";

import osmtogeojson from "osmtogeojson";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { FeatureName } from "./classes/feature-name-interface";

//Interface to define a Node with an id property
interface ChangeSetNode extends Node {
  id: string;
}

//Static class to query data for a project
export class QueryProject {
  static requests: XMLHttpRequest[] = [];
  static timeoutId = -1;

  //Function to clear the timeout if any
  private static clearTimeout() {
    if (QueryProject.timeoutId != -1) {
      window.clearTimeout(QueryProject.timeoutId);
    }
    QueryProject.timeoutId = -1;
  }

  //Function to request project data
  static requestProjectData() {
    //Abort requests in progress
    QueryProject.abortRequestInProgress();
    //Clear the timeout to avoid cross requests
    clearTimeout();
    //Reset the project values to empty the previous project loaded
    store.resetProjectLoaded();
    //Empty the message displayed
    store.emptyLoadingMessage();
    store.emptyErrorMessage();
    //Get the summary of the project
    QueryProject.getProjectSummary();
  }

  //Function to refresh the project data
  static refreshProjectData() {
    //Abort requests in progress
    QueryProject.abortRequestInProgress();
    //Clear the timeout to avoid cross requests
    clearTimeout();
    //Empty the error message if any
    store.emptyErrorMessage();
    //Get the changesets to refresh data
    QueryProject.getChangeSets();
  }

  private static abortRequestInProgress() {
    if (QueryProject.requests.length > 0) {
      let currentRequest: XMLHttpRequest | undefined;
      while ((currentRequest = QueryProject.requests.pop()) != undefined) {
        currentRequest.abort();
      }
    }
  }

  //Function to manage requests and answers
  private static async sendRequest(
    url: string,
    isJson = true
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      if (isJson) xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = () => {
        const currentIndex = QueryProject.requests.indexOf(xhr);
        if (currentIndex != -1) QueryProject.requests.splice(currentIndex, 1);
        else
          console.warn("Can't find the request corresponding to the answer.");
        switch (xhr.status) {
          case 200:
            resolve(xhr.responseText);
            break;
          case 400:
            store.emptyLoadingMessage();
            store.setErrorMessage(store.errors.BAD_REQUEST.format(url));
            break;
          case 429:
            store.emptyLoadingMessage();
            store.setErrorMessage(store.errors.TOO_MANY_REQUESTS.format(url));
            break;
          default:
            reject(Error(xhr.responseText));
            break;
        }
      };
      xhr.onerror = error => {
        console.warn(error);
        store.emptyLoadingMessage();
        store.setErrorMessage(store.errors.UNKNOWN_ERROR);
      };
      xhr.ontimeout = timeoutEvent => {
        console.warn(timeoutEvent);
        store.emptyLoadingMessage();
        store.setErrorMessage(store.errors.CONNECTION_TIMEOUT.format(url));
      };
      xhr.send();
      QueryProject.requests.push(xhr);
    });
  }

  //Get the project summary
  private static getProjectSummary() {
    //Display the loading message
    store.setLoadingMessage("Retrieving project summary...");
    const taskingManagerObject =
      store.constants.TASKING_MANAGER_URLS[store.state.chosenTaskingManager];
    //Build the url according to the store values
    const url =
      taskingManagerObject.apiURL +
      store.state.projectId +
      "/" +
      taskingManagerObject.summaryAPI;
    //Call sendRequest function
    return QueryProject.sendRequest(url).then(
      data => {
        //Parse the JSON data given as an answer
        const projectData = JSON.parse(data);
        //Store the JSON values wanted in the store
        store.setProjectNameCentroidAndPercentages(
          projectData.projectInfo
            ? projectData.projectInfo.name
            : projectData.name,
          projectData.percentMapped,
          projectData.percentValidated,
          projectData.aoiCentroid
        );
        QueryProject.getProjectAreaOfInterest();
      },
      () => {
        store.emptyLoadingMessage();
        //Display the error message of invalid project id
        store.setErrorMessage(
          store.errors.INVALID_PROJECT_ID.format(
            store.state.projectId.toString()
          )
        );
      }
    );
  }

  //Get the project area of interest
  private static getProjectAreaOfInterest() {
    //Display the loading message
    store.setLoadingMessage("Retrieving project area of interest...");
    const taskingManagerObject =
      store.constants.TASKING_MANAGER_URLS[store.state.chosenTaskingManager];
    //Build the url according to the store values
    const url =
      taskingManagerObject.apiURL +
      store.state.projectId +
      taskingManagerObject.abbreviatedOptions;
    //Call sendRequest function
    return QueryProject.sendRequest(url).then(data => {
      //Parse the JSON data given as an answer
      const projectData = JSON.parse(data);
      //Set the bounding box of the project in the store
      store.setProjectBoundingBox(projectData.areaOfInterest);
      QueryProject.getChangeSets();
    });
  }

  //Get the changesets of the project
  private static getChangeSets() {
    //Display the loading message
    store.setLoadingMessage("Retrieving project changesets...");
    //Build the url according to the store values
    const url = QueryProject.buildURL();
    const changeSetsIds: string[] = [];

    //Function to handle the callback of the request
    function getChangesetsFromXml(data: string) {
      //Define the selector used to get the elements wanted
      const selector =
        'tag[v*="#hotosm-project-' + store.state.projectId + '"]';
      //Parse the data fetch with the request as XML
      const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
      //Get all the changesets of the XML docuement
      const changesets = xmlDoc.querySelectorAll("changeset");
      //Filter the XML docuement with the selector
      const tagElmts = xmlDoc.querySelectorAll(selector);

      //Get the id of all the elements
      Array.from(tagElmts).map(currentTagElement => {
        const parentNode = currentTagElement.parentNode as ChangeSetNode | null;
        if (parentNode != null) {
          changeSetsIds.push(parentNode.id);
        }
      });

      //Check the length of the changesets
      if (changesets.length === 100) {
        //Get the time when the last changeset got close
        const newEnd = changesets[99].getAttribute("closed_at");
        //Build the URL according to the found time
        const newUrl = QueryProject.buildURL(newEnd);
        //Display the loading message
        store.setLoadingMessage("Retrieving project changesets...");
        //Call sendRequest function to get the other changesets
        QueryProject.sendRequest(newUrl).then(getChangesetsFromXml);
      } else {
        //Store the changesets ids
        store.setChangeSets(changeSetsIds);
        QueryProject.getFeaturesData();
      }
    }

    //Call sendRequest function with the url built
    return QueryProject.sendRequest(url).then(getChangesetsFromXml);
  }

  //Build the URL to get changesets
  private static buildURL(otherTimeEnd?: string | null) {
    const bboxString = "bbox=" + store.state.boundingBox.toBBoxString();
    const timeString =
      "time=" +
      store.state.startDateTime.utc().format() +
      "," +
      (otherTimeEnd ? otherTimeEnd : store.state.endDateTime.utc().format());
    return (
      store.constants.OSM_API_URL +
      "changesets?" +
      bboxString +
      "&" +
      timeString +
      "&" +
      "closed=true"
    );
  }

  private static async getTimeBeforeRetry(): Promise<number> {
    const status = await QueryProject.sendRequest(
      store.state.chosenServerURL.replace("interpreter", "status"),
      false
    );
    const regexIn = / in /gi,
      indices: number[] = [];
    while (regexIn.exec(status) !== null) {
      indices.push(regexIn.lastIndex);
    }

    const remainingSeconds = [];
    for (let i = 0; i < indices.length; ++i) {
      remainingSeconds.push(
        parseInt(status.substr(indices[i], status.indexOf(" ", indices[i])))
      );
    }
    return Math.max(...remainingSeconds);
  }

  private static getFeatures(
    data: string
  ): FeatureCollection<Geometry, GeoJsonProperties> {
    //Parse the XML data
    const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
    //Get the feature collection from the XML document
    const featureCollection = osmtogeojson(xmlDoc) as FeatureCollection<
      Geometry,
      GeoJsonProperties
    >;
    //Get the geometry according to the changesets we get before
    const newFeatures = featureCollection.features.filter(
      feature =>
        store.state.changeSetsIds.indexOf(feature.properties?.changeset) > -1
    );
    featureCollection.features = newFeatures;

    return featureCollection;
  }

  //Get OSM data (features geometry)
  private static getFeaturesData(): Promise<void> {
    clearTimeout();
    const types = ["building", "highway", "landuse", "waterway"];
    //Display the loading message
    store.setLoadingMessage(
      `Retrieving project features for ${types.join(", ")}`
    );
    const urls = QueryProject.createUrlRequest(types);

    //Callback function to handle error, if there is too many requests
    const onError = (error: string) => {
      console.error(`Unhandled error : ${error}`);
    };

    //Call sendRequest and handle to get all the features
    const promises = [];
    for (let i = 0; i < urls.length; ++i) {
      promises.push(QueryProject.sendRequest(urls[i]));
    }

    const whenAllSettled = async (results: PromiseSettledResult<string>[]) => {
      for (let i = types.length - 1; i > -1; --i) {
        if (results[i].status == "fulfilled") {
          urls.splice(i, 1);
          store.setFeatureCollection(
            types.splice(i, 1)[0] as keyof FeatureName,
            QueryProject.getFeatures(
              (results[i] as PromiseFulfilledResult<string>).value
            )
          );
        }
      }
      if (urls.length != 0) {
        const timeBeforeRetry = await QueryProject.getTimeBeforeRetry();
        const retryToGetFeaturesData = () => {
          const promises = [];
          //At least one request didn't make it
          for (let i = 0; i < urls.length; ++i) {
            promises.push(QueryProject.sendRequest(urls[i]));
          }
          store.setLoadingMessage(
            `Retrieving project features for ${types.join(", ")}`
          );

          Promise.allSettled(promises)
            .then(whenAllSettled)
            .catch(onError);
        };
        if (timeBeforeRetry > 0) {
          setTimeout(retryToGetFeaturesData, timeBeforeRetry * 1000);
        } else {
          retryToGetFeaturesData();
        }
      } else {
        store.emptyLoadingMessage();
        store.updateProjectLoaded();
      }
    };

    return Promise.allSettled(promises)
      .then(whenAllSettled)
      .catch(onError);
  }

  private static createUrlRequest(types: string[]): string[] {
    return types.map(
      type =>
        store.state.chosenServerURL +
        "?data=[bbox:" +
        store.state.boundingBox.toBBoxStringForOverpassAPI() +
        "];" +
        "way[" +
        type +
        '](changed:"' +
        store.state.startDateTime.utc().format() +
        '","' +
        store.state.endDateTime.utc().format() +
        '");' +
        "(._;>;);out+meta;"
    );
  }
}
