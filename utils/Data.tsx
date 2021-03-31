import Airtable from "airtable";
import NodeCache from "node-cache";
import haversine from "haversine";
import { OrganizedLocations, Location, RawLocation, CountyLinks, AvailabilityStatus } from "./DataTypes";

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
  query: () => Promise<any>,
): Promise<any> {
  let data = airtableCache.get(cacheKeyword);
  if (data == undefined) {
    try {
      data = await query();

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

export function getCountyLinks(county: string): Promise<CountyLinks> {
  return fetchAirtableData(
    `county-links-${county}`,
    async () => {
      const countyLinks = await Airtable.base("appdsheneg5ii1EnQ")("Counties").select().all();

      const countySpecificInfo = countyLinks
        .map((record) => record._rawJson)
        .filter((record) => record.fields.County === county);
  
      if (countySpecificInfo.length > 0) {
        return countySpecificInfo[0].fields;
      } else {
        return {};
      }
    }
  );
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

    (locations[i] as Location).isActiveSupersite =
      locations[i].fields["Location type"] === "Supersite" &&
      (locations[i] as Location).availabilityStatus.isAvailable;
  }

  return locations as Location[];
}

/**
 * Organize locations based on time and availability status for easier frontend
 * consumption.
 * @param locations The list of locations.
 * @returns Returns an organized list of locations.
 */
function organizeLocations(locations: Location[]): OrganizedLocations {
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
    outdatedLocations: separateAvailability(allOutdatedLocations),
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

function getDistance(lat: number, long: number, location: RawLocation): number {
  return haversine({
    latitude: lat,
    longitude: long,
  }, {
    latitude: location.fields.Latitude,
    longitude: location.fields.Longitude,
  }, {unit: 'mile'});
}

export async function getNearbyLocations(lat: number, long: number, distance: number): Promise<Location[]> {
  const allLocations: RawLocation[] = (
    await fetchAirtableData(
      "all",
      async () => {
        return (await Airtable.base("appdsheneg5ii1EnQ")("Locations").select({
          filterByFormula: `NOT({Do Not Display})`,
          sort: [
            {
              field: "Latest report",
              direction: "desc",
            },
          ],
        }).all()).map((record) => record._rawJson).filter((location) => (
          location.fields.Latitude && location.fields.Longitude
        ));
      }
    )
  );

  allLocations.forEach((location) => { location['distanceMiles'] = Math.floor(getDistance(lat, long, location) * 10) / 10 })

  const locationsWithinDistance: RawLocation[] = allLocations.filter((location) => location['distanceMiles'] <= distance);

  return preprocessLocations(locationsWithinDistance);
}

export function getCountyLocations(
  county: string
): Promise<OrganizedLocations> {
  return fetchAirtableData(
    county,
    async () => {
      const countyLocations: RawLocation[] = (await Airtable.base("appdsheneg5ii1EnQ")("Locations").select({
        filterByFormula: `AND(County = "${county}", NOT({Do Not Display}))`,
        sort: [
          {
            field: "Latest report",
            direction: "desc",
          },
        ],
      }).all()).map((record) => record._rawJson);

      const countyLocationsProcessed: Location[] = preprocessLocations(
        countyLocations
      );
    
      return organizeLocations(countyLocationsProcessed);
    }
  )
}
