import Airtable from "airtable";
import NodeCache from "node-cache";

const OUTDATED_DAYS_THRESHOLD = 3;

const airtableBackupCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 0,
});
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
  VARIES: { value: 2, string: "Availability varies", isAvailable: false },
  APPOINTMENT: {
    value: 3,
    string: "Yes, with appointment only",
    display: "With Appointment Only",
    isAvailable: true,
  },
  WALK_IN: {
    value: 4,
    string: "Yes, walk-ins accepted",
    display: "Walk-ins Accepted",
    isAvailable: true,
  },
  WAITLIST: {
    value: 5,
    string: "Waitlist Only",
    display: "Waitlist Only",
    isAvailable: true,
  },
};

export async function fetchAirtableData(cacheKeyword, airtableQuery) {
  let data = airtableCache.get(cacheKeyword);
  if (data == undefined) {
    try {
      data = await airtableQuery.all();

      airtableCache.set(cacheKeyword, data);
      airtableBackupCache.set(cacheKeyword, data);
    } catch (error) {
      console.error(error);

      // Attempt to load from backup cache.
      data = airtableBackupCache.get(cacheKeyword);

      if (data == undefined) {
        throw error;
      } else {
        // Reset the main cache to backup.
        console.log("Setting cache to backup.");
        airtableCache.set(cacheKeyword, data);
      }
    }
  }

  return data;
}

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

    console.log(`Encountered unknown availability status: '${vaccinesAvailableString}'`);
  }

  return AVAILABILITY_STATUS.UNKNOWN;
}

export async function getCountyLocations(county) {
  const countyLocations = (
    await fetchAirtableData(
      county,
      Airtable.base("appdsheneg5ii1EnQ")("Locations").select({
        filterByFormula: `County = "${county}"`,
        sort: [
          {
            field: "Latest report",
            direction: "desc",
          },
        ],
      })
    )
  ).map((record) => record._rawJson);

  for (let i = 0; i < countyLocations.length; i++) {
    countyLocations[i].availabilityStatus = getAvailabilityStatus(
      countyLocations[i].fields["Vaccines available?"]
    );
  }

  const outdatedThreshold = new Date();
  outdatedThreshold.setDate(
    outdatedThreshold.getDate() - OUTDATED_DAYS_THRESHOLD
  );

  const allRecentLocations = countyLocations.filter(
    (location) =>
      location.fields["Latest report"] &&
      Date.parse(location.fields["Latest report"]) > outdatedThreshold
  );
  const allOutdatedLocations = countyLocations.filter(
    (location) =>
      location.fields["Latest report"] &&
      Date.parse(location.fields["Latest report"]) <= outdatedThreshold
  );
  return {
    allLocations: countyLocations,
    allRecentLocations: allRecentLocations,
    allOutdatedLocations: allOutdatedLocations,
    recentLocations: {
      availableWaitlist: allRecentLocations.filter(
        (location) =>
          location.availabilityStatus.value ===
          AVAILABILITY_STATUS.WAITLIST.value
      ),
      availableAppointment: allRecentLocations.filter(
        (location) =>
          location.availabilityStatus.value ===
          AVAILABILITY_STATUS.APPOINTMENT.value
      ),
      availableWalkIn: allRecentLocations.filter(
        (location) =>
          location.availabilityStatus.value ===
          AVAILABILITY_STATUS.WALK_IN.value
      ),
    },
    outdatedLocations: {
      availableWaitlist: allOutdatedLocations.filter(
        (location) =>
          location.availabilityStatus.value ===
          AVAILABILITY_STATUS.WAITLIST.value
      ),
      availableAppointment: allOutdatedLocations.filter(
        (location) =>
          location.availabilityStatus.value ===
          AVAILABILITY_STATUS.APPOINTMENT.value
      ),
      availableWalkIn: allOutdatedLocations.filter(
        (location) =>
          location.availabilityStatus.value ===
          AVAILABILITY_STATUS.WALK_IN.value
      ),
    },
    availabilityVaries: countyLocations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.VARIES.value
    ),
    noAvailability: countyLocations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.NO.value
    ),
    noConfirmation: countyLocations.filter(
      (location) =>
        location.availabilityStatus.value ===
          AVAILABILITY_STATUS.UNKNOWN.value
    ),
  };
}
