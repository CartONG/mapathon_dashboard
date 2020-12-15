import { FeatureCollection, Geometry } from "geojson";

type FeatureType =
  | FeatureCollection<Geometry>
  | boolean
  | string[]
  | L.PathOptions
  | number
  | L.GeoJSON;

//Interface to declare the features
export interface FeatureName {
  building: FeatureType;
  highway: FeatureType;
  landuse: FeatureType;
  waterway: FeatureType;
}

export function* generator() {
  yield "building";
  yield "highway";
  yield "landuse";
  yield "waterway";
}
