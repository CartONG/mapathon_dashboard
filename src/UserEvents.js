'use strict';

import moment from 'moment';
import PubSub from './PubSub';
import { getOSMData } from './Actions';
import { DATETIME_FORMAT } from './Variables';

export function submitSearchForm(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  const params = {
    projectId: ev.target[0].value,
    startDateTime: moment(ev.target[1].value, DATETIME_FORMAT),
    endDateTime: moment(ev.target[2].value, DATETIME_FORMAT),
    server: ev.target[3].value
  };
  PubSub.publish('ACTIONS', getOSMData(params));
  return false;
}