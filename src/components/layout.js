'use strict';

import '../styles/layout.css';
import h from 'snabbdom/h';
import { OVP_DE, OVP_RU, OVP_FR, DATETIME_FORMAT } from '../Variables';
import { input, form, select, option, div, paragraph, progressBar } from './basic';
import { headerImageLink } from './custom';
import { submitSearchForm } from '../UserEvents';

import { getTotalDistance } from '../Distance';

export function header() {
  return h('header', [
    headerImageLink({
      linkHref: 'http://www.cartong.org/',
      imgId: 'cartong-logo',
      imgSrc: './images/CartONG_logo.png',
      imgAlt: 'CartONG logo'
    }),
    h('h1', 'Mapathon Dashboard'),
    headerImageLink({
      linkHref: 'http://www.missingmaps.org',
      imgId: 'mm-logo',
      imgSrc: './images/mm_logo.png',
      imgAlt: 'Missing Maps logo'
    }),
    headerImageLink({
      linkHref: 'https://www.hotosm.org',
      imgId: 'hot-logo',
      imgSrc: '/images/hot_logo.png',
      imgAlt: 'HOT logo'
    })
  ]);
}

export function searchBar(model) {
  return form({
    id: 'search-bar-form',
    submit: true,
    onsubmit: submitSearchForm,
    children: [
      input({
        id: 'project-id-input',
        type: 'number',
        name: 'projectID',
        label: 'Project ID'
      }),
      input({
        id: 'start-date-input',
        type: 'text',
        name: 'startDate',
        label: 'Start',
        value: model.startDateTime.format(DATETIME_FORMAT)
      }),
      input({
        id: 'end-date-input',
        type: 'text',
        name: 'endDate',
        label: 'End',
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
}

export function taskHeader(model)
{
  return div({
    classes: ['task-section'],
    children: [
      div({
        // id ?
        children: [
          h('h2', {}, [
            h('span', {attrs: {class: 'task-id-head'}}, '#'+model.project.id),
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
}


export function taskData(model)
{
  return div({
    classes: ['task-section'],
    children: [
      //h('h2', {}, 'Data from XXX to XXX'),
      div({
        classes: ['task-sub-section','three-column-task-sub-section'],
        children:[
          h('h4', {}, 'Map'),
          h('div#overlay-map',
          {
            hook:
            {
              insert: (vnode) =>
              {
                const map = L.map('overlay-map',
                  {
                    layers:
                    [
                      L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
                          attribution: 'Map tiles by <a>korona.geog.uni-heidelberg.de</a><br>Map data © <a href="http://www.openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://opendatacommons.org/licenses/odbl/1.0/">ODbL</a>',
                          maxZoom: 19
                      })
                    ]
                  }
                );
                map.setView([model.project.aoiCentroid.coordinates[1],model.project.aoiCentroid.coordinates[0]],10);
              }
            }
          })
        ]
      }),
      div({
        classes: ['task-sub-section','three-column-task-sub-section'],
        children: [
          h('h4', {}, 'Roads'),
          h('p', {}, model.OSMData['highway']['features'].length
            + ' road(s) created ('
            + getTotalDistance(model.OSMData['highway']['features']) + ' km)')
        ]
      }),
      div({
        classes: ['task-sub-section', 'three-column-task-sub-section'],
        children: [
          h('h4', {}, 'Buildings'),
          h('p', {}, model.OSMData['building']['features'].length + ' building(s) created'),
        ]
      }),
      div({
        classes: ['task-sub-section', 'three-column-task-sub-section'],
        children: [
          h('h4', {}, 'Landuse')
        ]
      }),
      div({
        classes: ['task-sub-section', 'three-column-task-sub-section'],
        children: [
          h('h4', {}, 'Waterways'),
          h('p', {}, model.OSMData['waterway']['features'].length
              + ' waterway(s) created ('
              + getTotalDistance(model.OSMData['waterway']['features']) + ' km)')
        ]
      })
    ]
  });
}
