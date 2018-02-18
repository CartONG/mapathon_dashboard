'use strict';

import lineDistance from '@turf/line-distance';

// This file offer functions to calculate distances for a set of roads and Waterways

export function getTotalDistance(lines){
  let dst = 0.;
  var line;
  var i;
  for (i = 0; i < lines.length; i++) {
    dst += lineDistance(lines[i], 'kilometers');
  }
  return Math.round(dst*10)/10;
}
