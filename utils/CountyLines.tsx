import countyGeoJSON from "../content/PaCounty2021.json";
import { point, multiPolygon } from "@turf/helpers";
import inside from "@turf/inside";

const countyPolygons = countyGeoJSON["features"].reduce((acc, county) => {
  acc[county.properties.COUNTY_NAME.toLowerCase()] = multiPolygon(
    county.geometry.coordinates
  );
  return acc;
}, {});

export function getCountyCodeFromLatLong(coordinates: [number?, number?]): string | undefined {
  if (!coordinates || coordinates.some((num) => !num)) {
    return undefined;
  }

  const locationPoint = point(coordinates);
  return Object.keys(countyPolygons).find((countyCode) =>
    inside(locationPoint, countyPolygons[countyCode])
  );
}