//Constant values
export class CONSTANTS {
  readonly OSM_API_URL = "https://www.openstreetmap.org/api/0.6/";
  readonly TASKING_MANAGER_URLS: {
    [key: string]: {
      abbreviatedOptions: string;
      apiURL: string;
      projectURL: string;
      summaryAPI: string;
    };
  } = {
    "Humanitarian OSM Team": {
      abbreviatedOptions: "/?abbreviated=true",
      apiURL:
        "https://tasking-manager-tm4-production-api.hotosm.org/api/v2/projects/",
      projectURL: "https://tasks.hotosm.org/projects/",
      summaryAPI: "queries/summary/"
    },
    "OSM Earth": {
      abbreviatedOptions: "?abbreviated=true",
      apiURL: "https://osm.earth/api/v1/project/",
      projectURL: "https://osm.earth/project/",
      summaryAPI: "summary"
    },
    teachOSM: {
      abbreviatedOptions: "/?abbreviated=true",
      apiURL:
        "https://tasking-manager-tm4-teachosm-api.hotosm.org/api/v2/projects/",
      projectURL: "https://tasks.teachosm.org/projects/",
      summaryAPI: "queries/summary/"
    },
    "OSM Paraguay": {
      abbreviatedOptions: "?abbreviated=true",
      apiURL: "https://tasks.atlasurbano.org/api/v1/project/",
      projectURL: "https://tasks.atlasurbano.org/project/",
      summaryAPI: "summary"
    },
    "OSM Colombia": {
      abbreviatedOptions: "?abbreviated=true",
      apiURL: "https://tareas.openstreetmap.co/api/v1/project/",
      projectURL: "https://tareas.openstreetmap.co/project/",
      summaryAPI: "summary"
    },
    "OSM Colorado": {
      abbreviatedOptions: "?abbreviated=true",
      apiURL: "https://osmcolorado.com/api/v1/project/",
      projectURL: "https://osmcolorado.com/project/",
      summaryAPI: "summary"
    },
    "OSM USA": {
      abbreviatedOptions: "/?abbreviated=true",
      apiURL: "https://tasks-backend.openstreetmap.us/api/v2/projects/",
      projectURL: "https://tasks.openstreetmap.us/projects/",
      summaryAPI: "queries/summary/"
    },
    // 'OSM Swiss': {
    //   'abbreviatedOptions': '?abbreviated=true',
    //   'apiURL': 'https://tasks.osm.ch/api/v1/project/',
    //   'projectURL': 'https://tasks.osm.ch/project/',
    //   'summaryAPI': 'summary'
    // },
    "OSM Italy": {
      abbreviatedOptions: "/?abbreviated=true",
      apiURL: "https://osmit-tm4.wmcloud.org/api/v2/projects/",
      projectURL: "https://osmit-tm4.wmcloud.org/projects/",
      summaryAPI: "queries/summary/"
    },
    "OSM Portugal": {
      abbreviatedOptions: "?abbreviated=true",
      apiURL: "https://tarefas.openstreetmap.pt/api/v1/project/",
      projectURL: "https://tarefas.openstreetmap.pt/project/",
      summaryAPI: "summary"
    }
    // 'OSM Spain': {
    //   'abbreviatedOptions': '?abbreviated=true',
    //   'apiURL': 'https://tareas.openstreetmap.es/api/v1/project/',
    //   'projectURL': 'https://tareas.openstreetmap.es/project/',
    //   'summaryAPI': 'summary'
    // },
    // 'OSM Indonesia': {
    //   'abbreviatedOptions': '?abbreviated=true',
    //   'apiURL': 'http://tasks.openstreetmap.id/api/v1/project/',
    //   'projectURL': 'http://tasks.openstreetmap.id/project/',
    //   'summaryAPI': 'summary'
    // },
    // 'OSM India': {
    //   'abbreviatedOptions': '?abbreviated=true',
    //   'apiURL': 'http://tasks.openstreetmap.in/api/v1/project/',
    //   'projectURL': 'http://tasks.openstreetmap.in/project/',
    //   'summaryAPI': 'summary'
    // },
    // 'OpenHistoricalMap': {
    //   'abbreviatedOptions': '?abbreviated=true',
    //   'apiURL': 'http://tasks.openhistoricalmap.org/api/v1/project/',
    //   'projectURL': 'http://tasks.openhistoricalmap.org/project/',
    //   'summaryAPI': 'summary'
    // }
  };
  readonly SERVERS = {
    "overpass-api.de": "https://overpass-api.de/api/interpreter",
    "overpass.nchc.org": "https://overpass.nchc.org.tw/api/interpreter"
  };
  readonly DATETIME_FORMAT = "DD/MM/YYYY HH:mm";
  readonly TIME_FORMAT = "HH:mm:ss";
}
