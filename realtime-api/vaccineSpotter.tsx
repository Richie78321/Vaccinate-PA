import fetch from "node-fetch";
import NodeCache from "node-cache";
import { countyCodes } from "../content/counties";
import moment from "moment";
import countyGeoJSON from "../content/PaCounty2021.json";
import { point, multiPolygon } from "@turf/helpers";
import inside from "@turf/inside";

const countyPolygons = countyGeoJSON["features"].reduce((acc, county) => {
  acc[county.properties.COUNTY_NAME.toLowerCase()] = multiPolygon(county.geometry.coordinates);
  return acc;
}, {});

interface ExpandedAppointment {
  time: string;
  type: string;
}

export interface ConsolidatedAppointment {
  num: number;
  time: string;
  types: string[];
}

export interface RealtimeLocation {
  geometry: {
    coordinates: [number?, number?];
  };
  properties: {
    id: number;
    url: string;
    city: string;
    name: string;
    state: string;
    address: string;
    provider: string;
    postal_code: string;
    appointments: ConsolidatedAppointment[] | ExpandedAppointment[];
    appointments_available: boolean;
    appointments_last_fetched: string;
    appointments_last_fetched_date?: number;
    countyCode?: string;
  };
  distanceMiles?: number;
}

// TODO : Could come up with a better way of storing this information.
const locationToCountyCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 0, // Never expire
});

const endpoint: string = "https://www.vaccinespotter.org/api/v0/states/PA.json";

function consolidateAppointments(
  appointments: ExpandedAppointment[]
): ConsolidatedAppointment[] {
  const appointmentsByTime: { [key: string]: ConsolidatedAppointment } = {};
  appointments.forEach((appointment) => {
    if (appointment.time) {
      let appointmentFormattedTime: string = moment(appointment.time)
        .startOf("day")
        .toISOString();

      const consolidatedAppointment: ConsolidatedAppointment =
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

export async function fetchLocations(): Promise<{
  [key: string]: RealtimeLocation[];
}> {
  const locationsList: RealtimeLocation[] = (
    await fetch(endpoint).then((resp) => resp.json())
  ).features.filter((location) => location.properties?.appointments_available);

  locationsList.forEach((location) => {
    location.properties.appointments_last_fetched_date = Date.parse(
      location.properties.appointments_last_fetched
    );
  });

  // Sort by latest
  locationsList.sort(
    (a, b) =>
      b.properties.appointments_last_fetched_date.valueOf() -
      a.properties.appointments_last_fetched_date.valueOf()
  );

  locationsList.forEach((location) => {
    if (
      location.properties.appointments &&
      location.properties.appointments.length > 0
    ) {
      location.properties.appointments = consolidateAppointments(
        location.properties.appointments as ExpandedAppointment[]
      );
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

async function getLocationCountyCode(
  location: RealtimeLocation
): Promise<string> {
  let locationCountyCode: string | undefined = locationToCountyCache.get(
    location.properties.id
  );
  if (locationCountyCode !== undefined) {
    return locationCountyCode;
  }

  const locationPoint = point(location.geometry.coordinates);
  locationCountyCode = Object.keys(countyPolygons).find((countyCode) => inside(locationPoint, countyPolygons[countyCode]));

  if (!locationCountyCode) {
    console.log(`Unable to find county code for location ID ${location.properties.id}`);
    return undefined;
  }

  locationToCountyCache.set(location.properties.id, locationCountyCode);

  return locationCountyCode;
}
