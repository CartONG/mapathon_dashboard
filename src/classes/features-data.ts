import { IFeatureName } from './feature-name-interface'

import { FeatureCollection, GeometryObject } from 'geojson';

//Class to manage the features geometry
export class FeaturesData implements IFeatureName {
  building!: FeatureCollection<GeometryObject>;
  highway!: FeatureCollection<GeometryObject>;
  landuse!: FeatureCollection<GeometryObject>;
  waterway!: FeatureCollection<GeometryObject>;

  setFeatures(building: FeatureCollection<GeometryObject>, highway: FeatureCollection<GeometryObject>, landuse: FeatureCollection<GeometryObject>, waterway: FeatureCollection<GeometryObject>)
  {
    this.building = building;
    this.highway = highway;
    this.landuse = landuse;
    this.waterway = waterway;
  }

  setFeatureCollection(featureName: keyof IFeatureName, featureCollection: FeatureCollection<GeometryObject>)
  {
    this[featureName] = featureCollection;
  }
};