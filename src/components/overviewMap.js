'use strict';

import L from 'leaflet';
import OVMapStyles from '../styles/OVMapStyles.json'
import icon from '../../public/images/leaflet/marker-icon.png';
import iconShadow from '../../public/images/leaflet/marker-shadow.png';

const OV_MAP_OPTS = {
  layers: [L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
    attribution: 'Map tiles by <a href="" target="_blank">korona.geog.uni-heidelberg.de</a> <br>Map data &copy; <a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://opendatacommons.org/licenses/odbl/1.0/" target="_blank">ODbL</a>',
    maxZoom: 19
  })]
};

export function displayOverviewMap(model) {
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    const map = L.map('overview-map', OV_MAP_OPTS);
    L.geoJson(model.OSMData.landuse, {style: OVMapStyles.STYLES.landuse}).addTo(map);
    L.geoJson(model.OSMData.highway, {style: OVMapStyles.STYLES.highway}).addTo(map);
    L.geoJson(model.OSMData.building, {style: OVMapStyles.STYLES.building}).addTo(map);
    L.geoJson(model.OSMData.waterway, {style: OVMapStyles.STYLES.waterway}).addTo(map);
    map.setView([model.project.aoiCentroid.coordinates[1], model.project.aoiCentroid.coordinates[0]], 10);
  return map;
}