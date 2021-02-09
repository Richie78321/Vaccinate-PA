import Airtable from "airtable";
import NodeCache from "node-cache";

const airtableCache = new NodeCache({
  stdTTL: 600, // Ten minutes
});

Airtable.configure({ apiKey: process.env.AIRTABLE_KEY });

export const AVAILABILITY_STATUS = {
  UNKNOWN: {
    value: 0,
    string: "No confirmation / unknown",
    isAvailable: false,
  },
  NO: { value: 1, string: "No", isAvailable: false },
  APPOINTMENT: {
    value: 2,
    string: "Yes, with appointment only",
    display: "With Appointment Only",
    isAvailable: true,
  },
  WALK_IN: {
    value: 3,
    string: "Yes, walk-ins accepted",
    display: "Walk-ins Accepted",
    isAvailable: true,
  },
  WAITLIST: {
    value: 4,
    string: "Waitlist Only",
    display: "Waitlist Only",
    isAvailable: true,
  },
};

// TODO: Not ideal, should look to change this in the AirTable soon.
export function getAvailabilityStatus(vaccinesAvailableString) {
  if (vaccinesAvailableString) {
    for (let statusValue in AVAILABILITY_STATUS) {
      if (
        vaccinesAvailableString[0] === AVAILABILITY_STATUS[statusValue].string
      ) {
        return AVAILABILITY_STATUS[statusValue];
      }
    }

    throw `Encountered unknown availability status: '${vaccinesAvailableString}'`;
  }

  return AVAILABILITY_STATUS.UNKNOWN;
}

export async function getCountyLocations(county) {
  let countyLocations = airtableCache.get(county);
  if (countyLocations == undefined) {
    countyLocations = (
      await Airtable.base("appdsheneg5ii1EnQ")("Locations")
        .select({
          filterByFormula: `County = "${county}"`,
          sort: [
            {
              field: "Latest report",
              direction: "desc",
            },
          ],
        })
        .all()
    ).map((record) => record._rawJson);
    airtableCache.set(county, countyLocations);
  }

  for (let i = 0; i < countyLocations.length; i++) {
    countyLocations[i].availabilityStatus = getAvailabilityStatus(
      countyLocations[i].fields["Vaccines available?"]
    );
  }

  return {
    allLocations: countyLocations,
    noConfirmationUncontacted: countyLocations.filter(
      (location) =>
        location.availabilityStatus.value ===
          AVAILABILITY_STATUS.UNKNOWN.value &&
        location.fields["Number of reports"] === 0
    ),
    noAvailability: countyLocations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.NO.value
    ),
    noConfirmation: countyLocations.filter(
      (location) =>
        location.availabilityStatus.value ===
          AVAILABILITY_STATUS.UNKNOWN.value &&
        location.fields["Number of reports"] > 0
    ),
    availableWaitlist: countyLocations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.WAITLIST.value
    ),
    availableAppointment: countyLocations.filter(
      (location) =>
        location.availabilityStatus.value ===
        AVAILABILITY_STATUS.APPOINTMENT.value
    ),
    availableWalkIn: countyLocations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.WALK_IN.value
    ),
  };
}
