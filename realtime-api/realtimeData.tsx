import NodeCache from "node-cache";
import { RealtimeLocation, fetchLocations } from "./vaccineSpotter";

const vaccineSpotterCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 60, // One minute
  checkperiod: 30, // Check for expiration every 30 seconds.
});
vaccineSpotterCache.on("expired", refreshVaccineSpotter);

function refreshVaccineSpotter(key: string, value, resolve, reject): void {
  fetchLocations()
    .then((locations) => {
      console.log(`Updated vaccine spotter data (key=${key})`);
      vaccineSpotterCache.set(key, locations);
      if (resolve) resolve(locations);
    })
    .catch((err) => {
      console.error(err);
      if (reject) reject();
    });
}

export async function getCounty(
  countyCode: string
): Promise<RealtimeLocation[]> {
  const latestCached:
    | { [key: string]: RealtimeLocation[] }
    | undefined = vaccineSpotterCache.get("latest");
  if (!latestCached) {
    // Request the realtime data if it has not already been loaded. This may be problematic if
    // there is a huge spike of requests following a server startup.
    return (
      await new Promise((resolve, reject) =>
        refreshVaccineSpotter("latest", null, resolve, reject)
      )
    )[countyCode];
  } else {
    return latestCached[countyCode];
  }
}
