import fetch from "node-fetch";
import NodeCache from "node-cache";
import { countyCodes } from '../content/counties';

// TODO : Could come up with a better way of storing this information.
const locationToCountyCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 0, // Never expire
});

const endpoints = [
  'https://www.vaccinespotter.org/api/v0/stores/PA/albertsons.json',
  'https://www.vaccinespotter.org/api/v0/stores/PA/cvs.json',
  'https://www.vaccinespotter.org/api/v0/stores/PA/rite_aid.json',
  'https://www.vaccinespotter.org/api/v0/stores/PA/sams_club.json',
  'https://www.vaccinespotter.org/api/v0/stores/PA/walgreens.json',
  'https://www.vaccinespotter.org/api/v0/stores/PA/walmart.json',
];

const fccLocationToCountyEndpoint = "https://geo.fcc.gov/api/census/block/find?";

export async function fetchLocations() {
  const locationsList = (await Promise.all(endpoints.map((endpoint) => {
    return fetch(endpoint).then((resp) => resp.json());
  })))
      .flat()
      .filter((location) => location.appointments_available);
  locationsList.forEach((location) => {
    location.appointments_last_fetched_date = Date.parse(location.appointments_last_fetched);
  });
  locationsList.sort((a, b) => b.appointments_last_fetched_date.valueOf() - a.appointments_last_fetched_date.valueOf())

  await Promise.all(locationsList.map(async (location) => {
    location.countyCode = await getLocationCountyCode(location);
  }, locationsList));

  const locationsDict = {
    all: locationsList,
  };
  countyCodes.forEach((countyCode) => locationsDict[countyCode] = []);

  locationsList.forEach((location) => {
    locationsDict[location.countyCode]?.push(location);
  });

  return locationsDict;
}

async function getLocationCountyCode(location) {
  let locationCountyCode = locationToCountyCache.get(location.id);
  if (locationCountyCode !== undefined) {
    return locationCountyCode;
  }

  locationCountyCode = (await fetch(fccLocationToCountyEndpoint + new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    format: "json",
  }).toString()).then((resp) => resp.json()))?.County?.name.toLowerCase();

  locationToCountyCache.set(location.id, locationCountyCode);

  return locationCountyCode;
}