import NodeCache from "node-cache";
import { fetchLocations } from "./vaccineSpotter";

const vaccineSpotterCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 60, // One minute
  checkperiod: 30, // Check for expiration every 30 seconds.
});
vaccineSpotterCache.on("expired", refreshVaccineSpotter);


function refreshVaccineSpotter(key, value) {
  fetchLocations().then((locations) => {
    console.log(`Updated vaccine spotter data (key=${key})`);
    vaccineSpotterCache.set(key, locations);
  })
}

export function getCounty(countyCode) {
  const latestCached = vaccineSpotterCache.get("latest");
  return latestCached ? latestCached[countyCode] : null;
}

refreshVaccineSpotter("latest", null);