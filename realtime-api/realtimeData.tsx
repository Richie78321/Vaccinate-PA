import NodeCache from "node-cache";
import { RealtimeLocation, fetchLocations } from "./vaccineSpotter";
import haversine from "haversine";

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

async function getLatestCached(): Promise<{
  [key: string]: RealtimeLocation[];
}> {
  const latestCached:
    | { [key: string]: RealtimeLocation[] }
    | undefined = vaccineSpotterCache.get("latest");
  if (!latestCached) {
    // Request the realtime data if it has not already been loaded. This may be problematic if
    // there is a huge spike of requests following a server startup.
    console.log("Request waiting for realtime to be cached.");
    return await new Promise((resolve, reject) =>
      refreshVaccineSpotter("latest", null, resolve, reject)
    );
  } else {
    return latestCached;
  }
}

export async function getCounty(
  countyCode: string
): Promise<RealtimeLocation[]> {
  return (await getLatestCached())[countyCode];
}

function getDistance(
  lat: number,
  long: number,
  location: RealtimeLocation
): number {
  return haversine(
    {
      latitude: lat,
      longitude: long,
    },
    {
      latitude: location.geometry.coordinates[1],
      longitude: location.geometry.coordinates[0],
    },
    { unit: "mile" }
  );
}

export async function getNearbyLocations(
  lat: number,
  long: number,
  distance: number
): Promise<RealtimeLocation[]> {
  const allLocations = (await getLatestCached())["all"];

  const locationsWithCoordinates = allLocations.filter(
    (location) =>
      location.geometry?.coordinates &&
      location.geometry?.coordinates.length >= 2 &&
      location.geometry?.coordinates.every((value) => value)
  );

  locationsWithCoordinates.forEach((location) => {
    location.distanceMiles =
      Math.floor(getDistance(lat, long, location) * 10) / 10;
  });

  return locationsWithCoordinates.filter(
    (location) => location.distanceMiles <= distance
  );
}
