import { LatLngBounds } from "leaflet";

export class MyLatLngBounds {
  private bounds: LatLngBounds;

  constructor(bounds: LatLngBounds) {
    this.bounds = bounds;
  }

  setBounds(bounds: LatLngBounds) {
    this.bounds = bounds;
  }

  //Bounding box as a string "W,S,E,N"
  toBBoxString(): string {
    return this.bounds.toBBoxString();
  }

  //OverpassAPI needs a special string for a bounding box "S,W,N,E"
  toBBoxStringForOverpassAPI(): string {
    return [
      this.bounds.getSouth(),
      this.bounds.getWest(),
      this.bounds.getNorth(),
      this.bounds.getEast(),
    ].join(",");
  }
}
