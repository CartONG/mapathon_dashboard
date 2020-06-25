import { IFeatureName } from './feature-name-interface'

import { FeatureCollection, Geometry } from 'geojson';

//Class to manage the features geometry
export class FeaturesData implements IFeatureName {
  building!: FeatureCollection<Geometry>;
  highway!: FeatureCollection<Geometry>;
  landuse!: FeatureCollection<Geometry>;
  waterway!: FeatureCollection<Geometry>;

  setFeatures(building: FeatureCollection<Geometry>, highway: FeatureCollection<Geometry>, landuse: FeatureCollection<Geometry>, waterway: FeatureCollection<Geometry>)
  {
    this.building = building;
    this.highway = highway;
    this.landuse = landuse;
    this.waterway = waterway;
  }

  setFeatureCollection(featureName: keyof IFeatureName, featureCollection: FeatureCollection<Geometry>)
  {
    this[featureName] = featureCollection;
  }
};