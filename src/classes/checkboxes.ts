import { IFeatureName } from './feature-name-interface'

//Class to manage checkboxes values
export class Checkboxes implements IFeatureName {
  building!: boolean;
  highway!: boolean;
  landuse!: boolean;
  waterway!: boolean;

  constructor()
  {
    this.reset();
  }

  reset()
  {
    this.building = true;
    this.highway = true;
    this.landuse = true;
    this.waterway = true;
  }
}