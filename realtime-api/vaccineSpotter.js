import fetch from "node-fetch";
import NodeCache from "node-cache";
import { countyCodes } from "../content/counties";
import moment from "moment";

// TODO : Could come up with a better way of storing this information.
const locationToCountyCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 0, // Never expire
});

const endpoint = "https://www.vaccinespotter.org/api/v0/states/PA.json";

const fccLocationToCountyEndpoint =
  "https://geo.fcc.gov/api/census/block/find?";

function consolidateAppointments(appointments) {
  const appointmentsByTime = {};
  appointments.forEach((appointment) => {
    if (appointment.time) {
      let appointmentFormattedTime = moment(appointment.time)
        .startOf("day")
        .toISOString();

      const consolidatedAppointment =
        appointmentsByTime[appointmentFormattedTime];

      if (consolidatedAppointment) {
        consolidatedAppointment.num++;
        if (!consolidatedAppointment.types.includes(appointment.type)) {
          consolidatedAppointment.types.push(appointment.type);
        }
      } else {
        appointmentsByTime[appointmentFormattedTime] = {
          time: appointmentFormattedTime,
          num: 1,
          types: [appointment?.type],
        };
      }
    }
  });

  return Object.values(appointmentsByTime);
}

export async function fetchLocations() {
  const locationsList = (await fetch(endpoint).then((resp) => resp.json()))
    .features
    .filter((location) => location.properties?.appointments_available);
  
  locationsList.forEach((location) => {
    location.properties.appointments_last_fetched_date = Date.parse(
      location.properties.appointments_last_fetched
    );
  });

  locationsList.sort(
    (a, b) =>
      b.properties.appointments_last_fetched_date.valueOf() -
      a.properties.appointments_last_fetched_date.valueOf()
  );

  locationsList.forEach((location) => {
    if (location.properties.appointments && location.properties.appointments.length > 0) {
      location.properties.appointments = consolidateAppointments(location.properties.appointments);
    }
  });

  await Promise.all(
    locationsList.map(async (location) => {
      location.properties.countyCode = await getLocationCountyCode(location);
    }, locationsList)
  );

  const locationsDict = {
    all: locationsList,
  };
  countyCodes.forEach((countyCode) => (locationsDict[countyCode] = []));

  locationsList.forEach((location) => {
    locationsDict[location.properties.countyCode]?.push(location);
  });

  return locationsDict;
}

async function getLocationCountyCode(location) {
  let locationCountyCode = locationToCountyCache.get(location.properties.id);
  if (locationCountyCode !== undefined) {
    return locationCountyCode;
  }

  locationCountyCode = (
    await fetch(
      fccLocationToCountyEndpoint +
        new URLSearchParams({
          latitude: location.geometry.coordinates[1],
          longitude: location.geometry.coordinates[0],
          format: "json",
        }).toString()
    ).then((resp) => resp.json())
  )?.County?.name.toLowerCase();

  if (!locationCountyCode) {
    console.log(`Failed to find a county for location ${location.properties.id}`);
  }

  locationToCountyCache.set(location.properties.id, locationCountyCode);

  return locationCountyCode;
}
