'use strict';

import PubSub from './PubSub';
import { setLeaderboard } from './Actions';
import lineDistance from '@turf/line-distance';

export function computeLeaderboard(OSMData){

  var bd_ld = new Map(); // for buildings_leaderboard
  var hw_ld = new Map(); // for highway_leaderboard;

  var i;
  for(i = 0; i < OSMData.building.features.length; i++){
    const building = OSMData.building.features[i];
    const user = building.properties.user;

    // the current user is unknown
    if(!bd_ld.get(user)){
      bd_ld.set(user, 1);
    }else{
      bd_ld.set(user, bd_ld.get(user) + 1);
    }
  }

  for(i = 0; i < OSMData.highway.features.length; i++){
    const highway = OSMData.highway.features[i];
    const user = highway.properties.user;
    const length = lineDistance(highway, 'kilometers');
    // the current user is unknown
    if(!hw_ld.get(user)){
      hw_ld.set(user, length);
    }else{
      hw_ld.set(user, hw_ld.get(user) + length);
    }
  }


  var bd_ld_array = Array.from(bd_ld);
  var hw_ld_array = Array.from(hw_ld);
  for(i = 0; i < hw_ld_array.length; i++){
    hw_ld_array[i][1] = (Math.round(100*hw_ld_array[i][1]))/100;
  }

  const leaderboard = {
    building: bd_ld_array.sort(function(a, b){
      return a[1] < b[1];
    }),
    highway: hw_ld_array.sort(function(a, b){
      return a[1] < b[1];
    }),
  };

  return leaderboard;
}
