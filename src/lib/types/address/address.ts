export interface StateData {
  [state: string]: DistrictData;
}

export interface DistrictData {
  districts: string[];
  district_count: number;
}
