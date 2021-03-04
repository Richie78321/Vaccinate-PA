import fetch from "node-fetch";
import NodeCache from "node-cache";
import { countyCodes } from "../content/counties";
import moment from "moment";

// TODO : Could come up with a better way of storing this information.
const locationToCountyCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 0, // Never expire
});

const endpoints = [
  "https://www.vaccinespotter.org/api/v0/stores/PA/albertsons.json",
  "https://www.vaccinespotter.org/api/v0/stores/PA/cvs.json",
  "https://www.vaccinespotter.org/api/v0/stores/PA/rite_aid.json",
  "https://www.vaccinespotter.org/api/v0/stores/PA/sams_club.json",
  "https://www.vaccinespotter.org/api/v0/stores/PA/walgreens.json",
  "https://www.vaccinespotter.org/api/v0/stores/PA/walmart.json",
];

// TODO : Move this to AirTable
const brands = {
  albertsons: {
    appointmentLink: "https://www.mhealthappointments.com/covidappt",
    name: "Safeway, Albertsons Pharmacy",
  },
  cvs: {
    appointmentLink: "https://www.cvs.com/immunizations/covid-19-vaccine",
    name: "CVS Pharmacy",
  },
  rite_aid: {
    appointmentLink: "https://www.riteaid.com/pharmacy/covid-qualifier",
    name: "Rite AID",
  },
  sams_club: {
    appointmentLink:
      "https://www.samsclub.com/pharmacy/immunization/form?imzType=covid",
    name: "Sam's Club",
  },
  walgreens: {
    appointmentLink:
      "https://www.walgreens.com/findcare/vaccination/covid-19/location-screening",
    name: "Walgreens",
  },
  walmart: {
    appointmentLink:
      "https://www.walmart.com/pharmacy/clinical-services/immunization/scheduled?imzType=covid",
    name: "Walmart",
  },
};

const fccLocationToCountyEndpoint =
  "https://geo.fcc.gov/api/census/block/find?";

function consolidateAppointments(appointments) {
  const appointmentsByTime = {};
  appointments.forEach((appointment) => {
    if (appointment.time) {
      let appointmentFormattedTime = moment(appointment.time).startOf('day').toISOString();

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
  const locationsList = (
    await Promise.all(
      endpoints.map((endpoint) => {
        return fetch(endpoint).then((resp) => resp.json());
      })
    )
  )
    .flat()
    .filter((location) => location.appointments_available);
  locationsList.forEach((location) => {
    location.appointments_last_fetched_date = Date.parse(
      location.appointments_last_fetched
    );
  });
  locationsList.sort(
    (a, b) =>
      b.appointments_last_fetched_date.valueOf() -
      a.appointments_last_fetched_date.valueOf()
  );

  locationsList.forEach((location) => {
    if (brands[location.brand]) {
      location.brand_info = brands[location.brand];
    }
  });

  locationsList.forEach((location) => {
    if (location.appointments && location.appointments.length > 0) {
      location.appointments = consolidateAppointments(location.appointments);
    }
  });

  await Promise.all(
    locationsList.map(async (location) => {
      location.countyCode = await getLocationCountyCode(location);
    }, locationsList)
  );

  const locationsDict = {
    all: locationsList,
  };
  countyCodes.forEach((countyCode) => (locationsDict[countyCode] = []));

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

  locationCountyCode = (
    await fetch(
      fccLocationToCountyEndpoint +
        new URLSearchParams({
          latitude: location.latitude,
          longitude: location.longitude,
          format: "json",
        }).toString()
    ).then((resp) => resp.json())
  )?.County?.name.toLowerCase();

  locationToCountyCache.set(location.id, locationCountyCode);

  return locationCountyCode;
}
