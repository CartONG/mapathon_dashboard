'use strict';

import lineDistance from '@turf/line-distance';
import area from '@turf/area';

export function getTotalDistance(lines){
  let dst = 0.;
  var i;
  for (i = 0; i < lines.length; i++) {
    dst += lineDistance(lines[i], 'kilometers');
  }
  return Math.round(dst*10)/10;
}

export function calcArea(areas) {
  console.log(areas);

  let surface = 0.;
  var i;
  for( i = 0; i < areas.length; i++){
    surface += area(areas[i]);
    console.log(areas[i].properties.landuse);
  }
  surface /= 1000000;
  return Math.round(surface * 100) / 100;
}