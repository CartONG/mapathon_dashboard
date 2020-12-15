interface String {
  format(...strings: string[]): string;
}

String.prototype.format = function(...rest) {
  const args = rest;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
};
