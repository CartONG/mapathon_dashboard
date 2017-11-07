'use strict';

const messages = {};
let lastUid = -1;

function subscribe(message, func) {
  if(typeof func !== 'function') {
    return false;
  }

  if(!messages.hasOwnProperty(message)) {
    messages[message] = {};
  }

  const token = 'uid_' + String(++lastUid);
  messages[message][token] = func;

  return token;
}

function publish(message, data) {
  if(!messages.hasOwnProperty(message)) {
    return false;
  }

  const subscribers = messages[message];
  for(let sub in subscribers) {
    subscribers[sub](message, data);
  }
}

export default { publish, subscribe };