//Constant values
export class CONSTANTS {
  static readonly OSM_API_URL = "https://www.openstreetmap.org/api/0.6/";
  static readonly DEFAULT_TAG = "hotosm-project";
  static readonly TASKING_MANAGER_INFORMATIONS: {
    [key: string]: {
      abbreviatedOptions: string;
      apiURL: string;
      projectURL?: string;
      summaryAPI: string;
      tag?: string;
    };
  } = {
    "Humanitarian OSM Team": {
      abbreviatedOptions: "/?abbreviated=true",
      apiURL:
        "https://tasking-manager-tm4-production-api.hotosm.org/api/v2/projects/",
      projectURL: "https://tasks.hotosm.org/projects/",
      summaryAPI: "/queries/summary/",
      tag: "hotosm-project",
    },
    "OSM Earth": {
      abbreviatedOptions: "?abbreviated=true",
      apiURL: "https://osm.earth/api/v1/project/",
      projectURL: "https://osm.earth/project/",
      summaryAPI: "/summary",
      tag: "osmearth",
    },
    teachOSM: {
      abbreviatedOptions: "/?abbreviated=true",
      apiURL:
        "https://tasking-manager-tm4-teachosm-api.hotosm.org//api/v2/projects/",
      projectURL: "https://tasks.teachosm.org/projects/",
      summaryAPI: "/queries/summary/",
      tag: "teachosm-project",
    },
    "OSM Paraguay": {
      abbreviatedOptions: "?abbreviated=true",
      apiURL: "https://tasks.atlasurbano.org/api/v1/project/",
      projectURL: "https://tasks.atlasurbano.org/project/",
      summaryAPI: "/summary",
      tag: "atlasurbano",
    },
    "OSM Colombia": {
      abbreviatedOptions: "?abbreviated=true",
      apiURL: "https://tareas.openstreetmap.co/api/v1/project/",
      projectURL: "https://tareas.openstreetmap.co/project/",
      summaryAPI: "/summary",
      tag: "osmco-project",
    },
    "OSM Colorado": {
      abbreviatedOptions: "?abbreviated=true",
      apiURL: "https://osmcolorado.com/api/v1/project/",
      projectURL: "https://osmcolorado.com/project/",
      summaryAPI: "/summary",
      tag: "osmco-project",
    },
    "OSM USA": {
      abbreviatedOptions: "/?abbreviated=true",
      apiURL: "https://tasks-backend.openstreetmap.us/api/v2/projects/",
      projectURL: "https://tasks.openstreetmap.us/projects/",
      summaryAPI: "/queries/summary/",
      tag: "osmus-tasks",
    },
    "OSM Italy": {
      abbreviatedOptions: "/?abbreviated=true",
      apiURL: "https://osmit-tm4.wmcloud.org/api/v2/projects/",
      projectURL: "https://osmit-tm4.wmcloud.org/projects/",
      summaryAPI: "/queries/summary/",
      tag: "osmitaly",
    },
    "OSM Portugal": {
      abbreviatedOptions: "?abbreviated=true",
      apiURL: "https://tarefas.openstreetmap.pt/api/v1/project/",
      projectURL: "https://tarefas.openstreetmap.pt/project/",
      summaryAPI: "/summary",
    },
    "OSM Indonesia": {
      abbreviatedOptions: "/?abbreviated=true",
      apiURL:
        "https://tasking-manager-indonesia-api.hotosm.org/api/v2/projects/",
      projectURL: "https://tasks-indonesia.hotosm.org/projects/",
      summaryAPI: "/queries/summary/",
      tag: "hotosm-id-project",
    },
    "Map With AI": {
      abbreviatedOptions: "/?abbreviated=true",
      apiURL:
        "https://mwai-tasking-manager-production-api.mapwith.ai/api/v2/projects/",
      projectURL: "https://tasks.mapwith.ai/projects",
      summaryAPI: "/queries/summary/",
      tag: "mapwithai-project",
    },
    // NOT SAME TM => API doesn't work the same => https://github.com/hotosm/osm-tasking-manager2/wiki/API
    // "OSM Swiss": {
    //   abbreviatedOptions: "?abbreviated=true",
    //   apiURL: "https://tasks.osm.ch/project/",
    //   projectURL: "https://tasks.osm.ch/project/#PROJECTID#.json",
    //   summaryAPI: "/summary",
    //   tag: "tasks-osmch-project"
    // },
    // 'OSM Spain': {
    //   'abbreviatedOptions': '?abbreviated=true',
    //   'apiURL': 'https://tareas.openstreetmap.es/api/v1/project/',
    //   'projectURL': 'https://tareas.openstreetmap.es/project/',
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
  static readonly SERVERS = {
    "overpass-api.de": "https://overpass-api.de/api/interpreter",
    "overpass.nchc.org": "https://overpass.nchc.org.tw/api/interpreter",
  };
  static readonly DATETIME_FORMAT = "DD/MM/YYYY HH:mm";
  static readonly TIME_FORMAT = "HH:mm:ss";

  static getProjectSummaryUrl(
    taskingManager: string,
    projectId: number
  ): string {
    const informations = CONSTANTS.TASKING_MANAGER_INFORMATIONS[taskingManager];
    return `${informations.apiURL}${projectId.toString()}${
      informations.summaryAPI
    }`;
  }

  static getProjectUrl(taskingManager: string, projectId: number): string {
    return `${
      CONSTANTS.TASKING_MANAGER_INFORMATIONS[taskingManager].projectURL
    }${projectId.toString()}`;
  }

  static getProjectAreaOfInterest(
    taskingManager: string,
    projectId: number
  ): string {
    const informations = CONSTANTS.TASKING_MANAGER_INFORMATIONS[taskingManager];
    return `${informations.apiURL}${projectId.toString()}${
      informations.abbreviatedOptions
    }`;
  }

  static getTag(taskingManager: string): string {
    const informations = CONSTANTS.TASKING_MANAGER_INFORMATIONS[taskingManager];
    if (!informations.tag) {
      console.warn("No tag found, default one will be used");
      return CONSTANTS.DEFAULT_TAG;
    }
    return informations.tag;
  }
}
