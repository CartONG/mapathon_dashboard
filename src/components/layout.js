'use strict';

import '../styles/layout.css';
import h from 'snabbdom/h';
import { OVP_DE, OVP_RU, OVP_FR, DATETIME_FORMAT, HOTOSM_PROJECT_URL } from '../Variables';
import { inputCheckbox, inputNumber, inputText, form, select, option, div, paragraph, progressBar, a } from './basic';
import { headerImageLink } from './custom';
import { submitSearchForm } from '../UserEvents';

import { destroyHighwayMap, displayHighwayMap, updateHighwayMap } from './highwayMap';
import { destroyOverviewMap, displayOverviewMap, onCheckboxClicked, updateOverviewMap } from './overviewMap';


export function header() {
  return h('header', [
    headerImageLink({
      linkHref: 'http://www.cartong.org/',
      imgId: 'cartong-logo',
      imgSrc: './images/CartONG_logo.png',
      imgAlt: 'CartONG logo'
    }),
    h('h1', 'Mapathon Dashboard'),
    headerImageLink(
    {
      linkHref: 'https://github.com/CartONG/mapathon_dashboard/',
      imgId: 'github-logo',
      imgSrc: './images/GitHub_logo.png',
      imgAlt: 'GitHub logo'
    }),
    headerImageLink({
      linkHref: 'http://www.missingmaps.org',
      imgId: 'mm-logo',
      imgSrc: './images/mm_logo.png',
      imgAlt: 'Missing Maps logo'
    }),
    headerImageLink({
      linkHref: 'https://www.hotosm.org',
      imgId: 'hot-logo',
      imgSrc: './images/hot_logo.png',
      imgAlt: 'HOT logo'
    })
  ]);
};

export function searchBar(model) {
  var getUTCOffsetFromMoment = function (moment)
  {
    var valueToReturn = 'UTC';
    if(!moment.isUtc())
    {
      var utcOffset = moment.toDate().getTimezoneOffset();

      if(utcOffset<0)
      {
        valueToReturn += '+';
        utcOffset *= -1;
      }
      else
      {
        valueToReturn += '-';
      }

      var minutes = utcOffset%60;

      valueToReturn+=Math.round(utcOffset/60);
      if(minutes!==0)
      {
        valueToReturn+=':'+minutes;
      }
    }

    return valueToReturn;
  };

  return form({
    id: 'search-bar-form',
    submit: true,
    onsubmit: submitSearchForm,
    children: [
      inputNumber({
        id: 'project-id-input',
        type: 'number',
        name: 'projectID',
        label: 'Project ID',
        min: 0
      }),
      inputText({
        id: 'start-date-input',
        type: 'text',
        name: 'startDate',
        label: 'Start ('+getUTCOffsetFromMoment(model.startDateTime)+')',
        value: model.startDateTime.format(DATETIME_FORMAT)
      }),
      inputText({
        id: 'end-date-input',
        type: 'text',
        name: 'endDate',
        label: 'End ('+getUTCOffsetFromMoment(model.endDateTime)+')',
        value: model.endDateTime.format(DATETIME_FORMAT)
      }),
      select({
        id: 'server-select',
        children: [
          option({
            value: OVP_DE,
            text: 'overpass-api.de'
          }),
          option({
            value: OVP_RU,
            text: 'overpass.osm.rambler.ru'
          }),
          option({
            value: OVP_FR,
            text: 'api.openstreetmap.fr'
          })
        ]
      })
    ]
  })
};

export function taskHeader(model)
{
  return div({
    classes: ['task-box'],
    children: [
      div({
        children: [
          h('h2', {}, [
            a({
              href: HOTOSM_PROJECT_URL + model.project.id,
              target: '_blank',
              children: [
                h('span', {attrs: {class: 'task-id-head'}}, '#'+model.project.id)
              ]
            }),
            h('text', {}, ' '+model.project.name)
          ])
        ]
      }),
      div({
        classes: ['task-grid'],
        children: [
          div({
            classes: ['two-column-task-info', 'task-info'],
            children: [
              paragraph({
                classes: ['task-info-key'],
                text: 'Done'
              }),
              progressBar({
                id: 'task-progress-done',
                value: model.project.percentMapped,
                text: model.project.percentMapped+'%'
              }),
              paragraph({
                text: model.project.percentMapped+'%'
              })
            ]
          }),
          div({
            classes: ['two-column-task-info','task-info'],
            children: [
              paragraph({
                classes: ['task-info-key'],
                text: 'Validated'
              }),
              progressBar({
                id: 'task-progress-validated',
                value: model.project.percentValidated,
                text: model.project.percentValidated+'%'
              }),
              paragraph({
                text: model.project.percentValidated+'%'
              })
            ]
          })
        ]
      })
    ]
  });
};

export function taskData(model)
{
  //
  model.checkboxNames = {};
  model.checkboxNames.roads = 'highway';
  model.checkboxNames.buildings = 'building';
  model.checkboxNames.landuse = 'landuse';
  model.checkboxNames.waterways = 'waterway';

  return div({
    classes: ['task-box'],
    children: [
      h('h2',
      {
        hook:
        {
          update: (oldVnode, vnode) =>
          {
            vnode.text = 'Last update (' + model.lastUpdateTime.format("HH:mm:ss") + ')';
          }
        }
      },
      'Last update (' + model.lastUpdateTime.format("HH:mm:ss") + ')'),
      div({
        classes: ['task-sub-section','three-column-task-sub-section'],
        children:[
          h('h4', {}, 'Map'),
          h('div#overview-map',
          {
            hook:
            {
              insert: (vnode) =>
              {
                displayOverviewMap(model);
              },
              update: (oldVnode, vnode) =>
              {
                updateOverviewMap(model.OSMData);
              },
              destroy: (vnode) =>
              {
                destroyOverviewMap();
              }
            }
          })
        ]
      }),
      div({
        classes: ['task-sub-section','three-column-task-sub-section'],
        children: [
          div({
            id: 'roads',
            children: [
              h('h4', {}, 'Roads'),
              inputCheckbox({
                id: 'roads-checkbox',
                name: model.checkboxNames.roads,
                label: 'Display roads on the map',
                value: 'roadsChecked',
                on:
                {
                  click: onCheckboxClicked
                }
              })
            ]
          }),
          h('p', {}, model.OSMData['highway']['features'].length
            + ' road(s) created ('
            + model.calculations.roadLength + ' km)'),
          h('div#highway-map',
          {
            hook:
            {
              insert: (vnode) =>
              {
                const startLongitude = 5.9215,
                  startLatitude = 45.58789;
                // Check if we can access the geolocation API
                if ("geolocation" in navigator) {
                  navigator.geolocation.getCurrentPosition(function onSuccess(position) {
                    vnode.map = displayHighwayMap(model.calculations.roadLength, position.coords.latitude, position.coords.longitude);
                  }, function onError(positionError)
                  {
                    displayHighwayMap(model.calculations.roadLength, startLatitude, startLongitude);
                  });
                }
                else
                {
                  displayHighwayMap(model.calculations.roadLength, startLatitude, startLongitude);
                }
              },
              update: (oldVnode, vnode) =>
              {
                updateHighwayMap(model.calculations.roadLength);
              },
              destroy: (vnode) =>
              {
                destroyHighwayMap();
              }
            }
          })
        ]
      }),
      div({
        classes: ['task-sub-section', 'three-column-task-sub-section'],
        children: [
          div({
            id: 'buildings',
            children: [
              h('h4', {}, 'Buildings'),
              inputCheckbox({
                id: 'buildings-checkbox',
                name: model.checkboxNames.buildings,
                label: 'Display buildings on the map',
                value: 'buildingsChecked',
                on:
                {
                  click: onCheckboxClicked
                }
              })
            ]
          }),
          h('p', {}, model.OSMData['building']['features'].length + ' building(s) created')
        ]
      }),
      div({
        classes: ['task-sub-section', 'three-column-task-sub-section'],
        children: [
          div({
            id: 'landuse',
            children: [
              h('h4', {}, 'Landuse'),
              inputCheckbox({
                id: 'landuse-checkbox',
                name: model.checkboxNames.landuse,
                label: 'Display landuse on the map',
                value: 'landuseChecked',
                on:
                {
                  click: onCheckboxClicked
                }
              })
            ]
          }),
          div({
            children:[
              h('b', {}, 'Residential landuse: '),
              h('span', {}, model.calculations.residentialLanduse + ' km²')
            ]
          }),
          div({
            children:[
              h('b', {}, 'Total landuse: '),
              h('span', {}, model.calculations.totalLanduse + ' km²')
            ]
          })
        ]
      }),
      div({
        classes: ['task-sub-section', 'three-column-task-sub-section'],
        children: [
          div({
            id: 'waterways',
            children: [
            h('h4', {}, 'Waterways'),
              inputCheckbox({
                id: 'waterways-checkbox',
                name: model.checkboxNames.waterways,
                label: 'Display waterways on the map',
                value: 'waterwaysChecked',
                on:
                {
                  click: onCheckboxClicked
                }
              })
            ]
          }),
          h('p', {}, model.OSMData['waterway']['features'].length
              + ' waterway(s) created ('
              + model.calculations.waterwayLength + ' km)')
        ]
      }),
      h('p.white', {},'.')
    ]
  });
};

function listLeader(rank, unity){
  const max_length = Math.min(25, rank.length);
  var list = [];
  var i;

  for(i = 0; i < max_length; i++){

    list.push(
      h('li', {}, rank[i][0] + " : " + rank[i][1] + unity)
    );
  }
  return list;
};

export function taskLeaderboard(model){
  const list_buildings = model.leaderboard.building.length > 0? listLeader(model.leaderboard.building, ""):null;
  const list_roads = model.leaderboard.highway.length > 0? listLeader(model.leaderboard.highway, " km"): null;

  const buildings_leaderboard = list_buildings === null ? null : div({
    classes: ['task-sub-section', 'two-column-task-sub-section'],
    children: [
      h('h4', {}, 'Buildings'),
      h('ol', {}, list_buildings)
    ]
  });

  const roads_leaderboard = list_roads === null ? null : div({
    classes: ['task-sub-section', 'two-column-task-sub-section'],
    children: [
      h('h4', {}, 'Roads'),
      h('ol', {}, list_roads)
      ]
    });


  const divLeaderboard = list_roads === null && list_buildings === null ?null:div({
      classes: ['task-box'],
      children: [
        h('h2', {}, 'Leaderboard'),
        div({
          classes: ['task-grid'],
          children:[
            buildings_leaderboard,
            roads_leaderboard
          ]
        })
      ]
    });
  return divLeaderboard;
};

export function taskProgress(model)
{
  return div({
    classes: ['task-loading'],
    children: [
      paragraph({
        text: model.loadingMessage
      }),
      div({
        classes: ['loader-ring'],
        children: [
          div({}),
          div({}),
          div({}),
          div({})
        ]
      })
    ]
  });
};

export function showError(model)
{
  if(model.errorMessage)
  {
    return paragraph({
      id: 'error',
      text: model.errorMessage
    })
  }
  else
  {
    return null;
  }
};