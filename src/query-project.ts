import { store } from './store'

import * as osmtogeojson  from 'osmtogeojson'

//Interface to define a Node with an id property
interface IChangeSetNode extends Node
{
  id: string;
}

//Static class to query data for a project
export namespace QueryProject {
  const requests: XMLHttpRequest[] = [];
  let timeoutId = -1;

  //Function to request project data
  export function requestProjectData()
  {
    //Clear the timeout to avoid cross requests
    clearTimeout();
    //Reset the project values to empty the previous project loaded
    store.resetProjectLoaded();
    //Empty the message displayed
    store.emptyLoadingMessage();
    store.emptyErrorMessage();
    //Get the summary of the project
    getProjectSummary();
  }

  //Function to refresh the project data
  export function refreshProjectData()
  {
    //Clear the timeout to avoid cross requests
    clearTimeout();
    //Empty the error message if any
    store.emptyErrorMessage();
    //Get the changesets to refresh data
    getChangeSets();
  }

  //Function to manage requests and answers
  function sendRequest(url: string): Promise<string>
  {
    return new Promise((resolve, reject) => {
      if(requests.length>0)
      {
        const lastRequest = requests.pop();
        lastRequest!.abort();
      }
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = () => {
        requests.pop();
        store.emptyLoadingMessage();
        switch(xhr.status)
        {
          case 200:
            resolve(xhr.responseText);
            break;
          case 400:
            store.setErrorMessage(store.errors.BAD_REQUEST.format(url));
            break;
          case 429:
            store.setErrorMessage(store.errors.TOO_MANY_REQUESTS.format(url));
            break;
          default:
            reject(Error(xhr.responseText));
            break;
        }
      };
      xhr.onerror = (error) => {
        console.warn(error);
        store.setErrorMessage(store.errors.UNKNOWN_ERROR);
      };
      xhr.ontimeout = (timeoutEvent) => {
        console.warn(timeoutEvent);
        store.setErrorMessage(store.errors.CONNECTION_TIMEOUT.format(url));
      };
      xhr.send();
      requests.push(xhr);
    });
  };

  //Get the project summary
  function getProjectSummary()
  {
    //Display the loading message
    store.setLoadingMessage("Retrieving project summary...");
    //Build the url according to the store values
    const url = store.constants.HOTOSM_API_URL + store.state.projectId + '/summary';
    //Call sendRequest function
    return sendRequest(url).then(data => {
      //Parse the JSON data given as an answer
      const projectData = JSON.parse(data);
      //Store the JSON values wanted in the store
      store.setProjectNameCentroidAndPercentages(projectData.name, projectData.percentMapped, projectData.percentValidated, projectData.aoiCentroid);
      getProjectAreaOfInterest();
    }, 
    () =>
    {
      //Display the error message of invalid project id
      store.setErrorMessage(store.errors.INVALID_PROJECT_ID.format(store.state.projectId.toString()));
    });
  };

  //Get the project area of interest
  function getProjectAreaOfInterest()
  {
    //Display the loading message
    store.setLoadingMessage("Retrieving project area of interest...")
    //Build the url according to the store values
    const url = store.constants.HOTOSM_API_URL + store.state.projectId + '?abbreviated=true';
    //Call sendRequest function
    return sendRequest(url).then(data => {
      //Parse the JSON data given as an answer
      const projectData = JSON.parse(data);
      //Set the bounding box of the project in the store
      store.setProjectBoundingBox(projectData.areaOfInterest);
      getChangeSets();
    });
  };

  //Get the changesets of the project
  function getChangeSets()
  {
    //Display the loading message
    store.setLoadingMessage("Retrieving project changesets...");
    //Build the url according to the store values
    const url = buildURL();
    const changeSetsIds:string[] = [];
    //Call sendRequest function with the url built
    return sendRequest(url).then(getChangesetsFromXml);
  
    //Function to handle the callback of the request
    function getChangesetsFromXml(data: string) {
      //Define the selector used to get the elements wanted
      const selector = 'tag[v*="#hotosm-project-' + store.state.projectId + '"]';
      //Parse the data fetch with the request as XML
      const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
      //Get all the changesets of the XML docuement
      const changesets = xmlDoc.querySelectorAll('changeset');
      //Filter the XML docuement with the selector
      const tagElmts = xmlDoc.querySelectorAll(selector);
  
      //Get the id of all the elements
      Array.from(tagElmts).map(currentTagElement => { 
        let parentNode = currentTagElement.parentNode as IChangeSetNode | null;
        changeSetsIds.push(parentNode!.id);
      });

      //Check the length of the changesets
      if(changesets.length === 100) {
        //Get the time when the last changeset got close
        const newEnd = changesets[99].getAttribute('closed_at');
        //Build the URL according to the found time
        const newUrl = buildURL(newEnd);
        //Display the loading message
        store.setLoadingMessage("Retrieving project changesets...");
        //Call sendRequest function to get the other changesets
        sendRequest(newUrl).then(getChangesetsFromXml);
      } else {
        //Store the changesets ids
        store.setChangeSets(changeSetsIds);
        getOSMData();
      }
    }
  };

  //Build the URL to get changesets
  function buildURL(otherTimeEnd?: string | null) {
    const bboxString = 'bbox=' + store.state.boundingBox.toBBoxString();
    const timeString = 'time=' + store.state.startDateTime.utc().format() + ',' + (otherTimeEnd?otherTimeEnd:store.state.endDateTime.utc().format());
    return store.constants.OSM_API_URL + 'changesets?' + bboxString + '&' + timeString + '&' + 'closed=true';
  };
  
  //Get OSM data (features geometry)
  function getOSMData(): Promise<void>
  {
    clearTimeout();
    //Display the loading message 
    store.setLoadingMessage("Retrieving project features for buildings...");
    const types = ['building','highway','landuse','waterway'];
    const urls = types.map(type => 
      store.state.chosenServer + '?data=[bbox:' + store.state.boundingBox.toBBoxStringForOverpassAPI() + '];'
      + 'way[' + type + '](changed:"' + store.state.startDateTime.utc().format() + '","' + store.state.endDateTime.utc().format() + '");'
      + '(._;>;);out+meta;'
      // return OVP_DE ? buildOAPIReqWithEndDate(server, bbox, type, tmpStart, tmpEnd)
      //   : buildOAPIReqWithoutEndDate(server, bbox, type, tmpStart) 
    );
  
    //Callback function to handle error, if there is too many requests
    const onError = (error: any) =>
    {
      console.log(error);
      //Create a timeout to try to request again 
      timeoutId = window.setTimeout(() => getOSMData(), 30 * 1000);
    }
    //Call sendRequest and handle to get all the features
    return sendRequest(urls[0]).then(data => {//building
      store.setOSMData("building", getFeatures(data))
      //Display the loading message
      store.setLoadingMessage("Retrieving project features for highway...");
      return sendRequest(urls[1]);
    }, error => onError(error))
    .then(data => {//highway
      store.setOSMData("highway", getFeatures(data as string));
      //Display the loading message
      store.setLoadingMessage("Retrieving project features for landuse...");
      return sendRequest(urls[2]);
    }, error => onError(error))
    .then(data => {//landuse
      store.setOSMData("landuse", getFeatures(data as string));
      //Display the loading message
      store.setLoadingMessage("Retrieving project features for waterway...");
      return sendRequest(urls[3]);
    }, error => onError(error))
    .then(data => {//waterway
      store.setOSMData("waterway", getFeatures(data as string));
      store.updateProjectLoaded();
    }, error => onError(error));
  
    function getFeatures(data: string) {
      //Parse the XML data
      const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
      //Get the feature collection from the XML document
      const featureCollection = osmtogeojson(xmlDoc);
      //Get the geometry according to the changesets we get before
      const newFeatures = featureCollection.features
        .filter(feature => store.state.changeSetsIds.indexOf(feature.properties.changeset) > -1);
      featureCollection.features = newFeatures;
      return featureCollection;
    };
  };

  //Function to clear the timeout if any
  function clearTimeout()
  {
    if(timeoutId!=-1)
    {
      window.clearTimeout(timeoutId);
    }
    timeoutId = -1;
  }

  // function buildOAPIReqWithoutEndDate(server, bbox, type, startDate) {
  //   return server + '?data=[bbox:' + bbox.s + ',' + bbox.w + ',' + bbox.n + ',' + bbox.e + '];'
  //     + 'way[' + type + '](newer:"' + startDate.utc().format() + '");'
  //     + '(._;>;);out+meta;';
  // };
  
  // function buildOAPIReqWithEndDate(server, bbox, type, startDate, endDate) {
  //   return server + '?data=[bbox:' + bbox.s + ',' + bbox.w + ',' + bbox.n + ',' + bbox.e + '];'
  //     + 'way[' + type + '](changed:"' + startDate.utc().format() + '","' + endDate.utc().format() + '");'
  //     + '(._;>;);out+meta;';
} 