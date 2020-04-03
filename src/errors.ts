//Error messages
export const ERRORS = {
  BAD_REQUEST: new String("Bad syntax for the URL '{0}'. Check out given dates."),
  CONNECTION_TIMEOUT: new String("Connection to the URL '{0}' has timeout."),
  INVALID_PROJECT_ID: new String("Given project id '{0}' can not be found."),
  TOO_MANY_REQUESTS: new String("The URL '{0}' has been requested too many times in a given time. Try again later."),
  UPDATIME_PASSED: "Update time is newer than end date time, so new changesets won't be fetched. Consider to change end date time.",
  UNKNOWN_ERROR: "An unknown error occured (See console for more logs)."
};