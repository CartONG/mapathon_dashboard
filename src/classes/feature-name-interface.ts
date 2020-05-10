//Interface to declare the features
export interface IFeatureName {
  building: any;
  highway: any;
  landuse: any;
  waterway: any;
};

export function * generator()
{
  yield 'building'
  yield 'highway'
  yield 'landuse'
  yield 'waterway'
}