'use strict';

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

export const INVALID_PROJECT_ID = "Given project id '{0}' can not be found.";
export const CONNECTION_TIMEOUT = "Connection to the URL '{0}' has timeout.";
export const UNKNOWN_ERROR = "An unknown error occured (See console for more logs).";
