import Airtable from "airtable";
import NodeCache from "node-cache";

interface AvailabilityStatus {
  value: number;
  string: string;
  display?: string;
  isAvailable: boolean;
}

interface CountyLinks {
  "County Website"?: string;
  "County COVID Information"?: string;
  "County COVID Preregistration"?: string;
}

interface RawLocation {
  id: string;
  fields: {
    Name: string;
    Website?: string;
    County: string;
    "Latest report"?: string;
    "Vaccines available?"?: string[];
    "Latest report notes"?: string[];
    "Number of reports": number;
    Address: string;
    "Location type"?: string;
  };
}

interface Location extends RawLocation {
  isSupersite: boolean;
  availabilityStatus: AvailabilityStatus;
}

interface CountyLocations {
  allLocations: Location[];
  allRecentLocations: Location[];
  allOutdatedLocations: Location[];
  recentLocations: {
    availableWaitlist: Location[];
    availableAppointment: Location[];
    availableWalkIn: Location[];
  };
  outdatedLocations: {
    availableWaitlist: Location[];
    availableAppointment: Location[];
    availableWalkIn: Location[];
  };
  availabilityVaries: Location[];
  noAvailability: Location[];
  noConfirmation: Location[];
}

const OUTDATED_DAYS_THRESHOLD = 3;

const airtableBackupCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 0,
});
const airtableCache = new NodeCache({
  stdTTL: 600, // Ten minutes
});

// @ts-ignore
Airtable.configure({ apiKey: process.env.AIRTABLE_KEY });

export const AVAILABILITY_STATUS: { [key: string]: AvailabilityStatus } = {
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

export async function fetchAirtableData(
  cacheKeyword: string,
  airtableQuery
): Promise<any> {
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
export function getAvailabilityStatus(
  vaccinesAvailableString: string[]
): AvailabilityStatus {
  if (vaccinesAvailableString) {
    for (let statusValue in AVAILABILITY_STATUS) {
      if (
        vaccinesAvailableString[0] === AVAILABILITY_STATUS[statusValue].string
      ) {
        return AVAILABILITY_STATUS[statusValue];
      }
    }

    console.log(
      `Encountered unknown availability status: '${vaccinesAvailableString}'`
    );
  }

  return AVAILABILITY_STATUS.UNKNOWN;
}

export async function getCountyLinks(county: string): Promise<CountyLinks> {
  const countyLinks = await fetchAirtableData(
    "county-links",
    Airtable.base("appdsheneg5ii1EnQ")("Counties").select()
  );

  const countySpecificInfo = countyLinks
    .map((record) => record._rawJson)
    .filter((record) => record.fields.County === county);

  if (countySpecificInfo.length > 0) {
    return countySpecificInfo[0].fields;
  } else {
    return {};
  }
}

/**
 * Preprocess locations fetched from AirTable.
 * @param locations The list of raw locations fetched from AirTable.
 */
function preprocessLocations(locations: RawLocation[]): Location[] {
  for (let i = 0; i < locations.length; i++) {
    (locations[i] as Location).availabilityStatus = getAvailabilityStatus(
      locations[i].fields["Vaccines available?"]
    );

    (locations[i] as Location).isSupersite = locations[i]["Location type"] === "Supersite";
  }

  return locations as Location[];
}

/**
 * Organize locations based on time and availability status for easier frontend
 * consumption.
 * @param locations The list of locations.
 * @returns Returns an organized list of locations.
 */
function organizeLocations(locations: Location[]): CountyLocations {
  const outdatedThreshold: Date = new Date();
  outdatedThreshold.setDate(
    outdatedThreshold.getDate() - OUTDATED_DAYS_THRESHOLD
  );

  const allRecentLocations: Location[] = locations.filter(
    (location) =>
      location.fields["Latest report"] &&
      Date.parse(location.fields["Latest report"]) > outdatedThreshold.getTime()
  );
  const allOutdatedLocations: Location[] = locations.filter(
    (location) =>
      location.fields["Latest report"] &&
      Date.parse(location.fields["Latest report"]) <=
        outdatedThreshold.getTime()
  );

  const separateAvailability = (locations) => ({
    availableWaitlist: locations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.WAITLIST.value
    ),
    availableAppointment: locations.filter(
      (location) =>
        location.availabilityStatus.value ===
        AVAILABILITY_STATUS.APPOINTMENT.value
    ),
    availableWalkIn: locations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.WALK_IN.value
    ),
  });

  return {
    allLocations: locations,
    allRecentLocations: allRecentLocations,
    allOutdatedLocations: allOutdatedLocations,
    recentLocations: separateAvailability(allRecentLocations),
    outdatedLocations: separateAvailability(allRecentLocations),
    availabilityVaries: locations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.VARIES.value
    ),
    noAvailability: locations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.NO.value
    ),
    noConfirmation: locations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.UNKNOWN.value
    ),
  };
}

export async function getCountyLocations(
  county: string
): Promise<CountyLocations> {
  const countyLocations: RawLocation[] = (
    await fetchAirtableData(
      county,
      Airtable.base("appdsheneg5ii1EnQ")("Locations").select({
        filterByFormula: `AND(County = "${county}", NOT({Do Not Display}))`,
        sort: [
          {
            field: "Latest report",
            direction: "desc",
          },
        ],
      })
    )
  ).map((record) => record._rawJson);

  const countyLocationsProcessed: Location[] = preprocessLocations(countyLocations);

  return organizeLocations(countyLocationsProcessed);
}
