import { FeatureName, generator } from "./feature-name-interface";

//Class to manage checkboxes values
export class Checkboxes implements FeatureName {
  building!: boolean;
  highway!: boolean;
  landuse!: boolean;
  waterway!: boolean;

  constructor() {
    this.reset();
  }

  reset() {
    this.building = true;
    this.highway = true;
    this.landuse = true;
    this.waterway = true;
  }

  uncheckAllExcept(feature: keyof FeatureName) {
    for (const currenFeature of generator()) {
      if (currenFeature == feature) {
        this[currenFeature] = true;
      } else {
        this[currenFeature] = false;
      }
    }
  }

  update(feature: keyof FeatureName) {
    this[feature] = !this[feature];
  }
}
