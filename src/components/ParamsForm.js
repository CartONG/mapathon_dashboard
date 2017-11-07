'use strict';

import '../styles/ParamsForm.css';
import h from 'snabbdom/h';
import moment from 'moment';
import { OVP_DE, OVP_RU, OVP_FR, TIME_OFFSET, DATETIME_FORMAT } from '../Variables';
import { setSearchParams } from '../Actions';

function submitForm(handler, ev) {
  ev.preventDefault();
  ev.stopPropagation();
  const params = {
    projectId: ev.target[0].value,
    startDateTime: moment(ev.target[1].value, DATETIME_FORMAT).format('YYYY-MM-DDTHH:mmZ'),
    endDateTime: moment(ev.target[2].value, DATETIME_FORMAT).format('YYYY-MM-DDTHH:mmZ'),
    server: ev.target[3].value
  };
  handler.publish('ACTIONS', setSearchParams(params));
  return false;
}

function view(model, handler) {
  const start = moment().add(TIME_OFFSET, 'm').set('minute', 0);
  const end = moment().add(1, 'h').set('minute', 0);

  return h('form#params-form', { on: { submit: submitForm.bind(this, handler) } },[
    h('label', { attrs: { for: 'project-id-input' } }, 'Project ID'),
    h('input#project-id-input', { attrs: { type: 'number', name: 'projectID' } }),
    h('label', { attrs: { for: 'start-date-input' } }, 'Start'),
    h('input#start-date-input', { attrs: { type: 'text', name: 'startDate', value: start.format(DATETIME_FORMAT) } }),
    h('label', { attrs: { for: 'end-date-input', placeholder: end.format(DATETIME_FORMAT) } }, 'End'),
    h('input#end-date-input', { attrs: { type: 'text', name: 'endDate', value: end.format(DATETIME_FORMAT) } }),
    h('label', { attrs: { for: 'server-select' } }, 'Server'),
    h('select#server-select', [
      h('option', { attrs: { value: OVP_DE } }, 'overpass-api.de'),
      h('option', { attrs: { value: OVP_RU } }, 'overpass.osm.rambler.ru'),
      h('option', { attrs: { value: OVP_FR } }, 'api.openstreetmap.fr')
    ]),    
    h('input.button-primary', { attrs: { value: 'Submit', type: 'submit' } })
  ]);
}

export default { view }