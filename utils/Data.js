import Airtable from "airtable";
import NodeCache from "node-cache";
import haversine from "haversine";

const OUTDATED_DAYS_THRESHOLD = 3;

const LOCATION_MILE_THRESHOLDS = [5, 10, 25, 50, 75, 100];

const backupDataCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 0,
});
const dataCache = new NodeCache({
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

export async function cacheData(cacheKeyword, query, ttl) {
  let data = dataCache.get(cacheKeyword);
  if (data == undefined) {
    try {
      data = await query();

      dataCache.set(cacheKeyword, data, ttl);
      backupDataCache.set(cacheKeyword, data, ttl);
    } catch (error) {
      console.error(error);

      // Attempt to load from backup cache.
      data = backupDataCache.get(cacheKeyword);

      if (data == undefined) {
        throw error;
      } else {
        // Reset the main cache to backup.
        console.log("Setting cache to backup.");
        dataCache.set(cacheKeyword, data, ttl);
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

    console.log(
      `Encountered unknown availability status: '${vaccinesAvailableString}'`
    );
  }

  return AVAILABILITY_STATUS.UNKNOWN;
}

export async function getCountyLinks(county) {
  const countyLinks = (await cacheData(
    "county-links",
    async () => (await Airtable.base("appdsheneg5ii1EnQ")("Counties").select().all()).map((record) => record._rawJson),
    3600 // One hour
  )).filter((record) => record.fields.County === county);

  if (countyLinks.length > 0) {
    return countyLinks[0].fields;
  } else {
    return {};
  }
}

// TODO : Both this and the lat long location function are in need of a serious
// refactor WRT the location groups and categories.
export function getCountyLocations(county) {
  return cacheData(
    county,
    async () => {
      const countyLocations = (await Airtable.base("appdsheneg5ii1EnQ")("Locations").select({
        filterByFormula: `County = "${county}"`,
        sort: [
          {
            field: "Latest report",
            direction: "desc",
          },
        ],
      }).all()).map((record) => record._rawJson);

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
            location.availabilityStatus.value === AVAILABILITY_STATUS.UNKNOWN.value
        ),
      };
    }
  );
}

export function getLatLongLocations(latitude, longitude) {
  // Could employ some sort of lat-long discretization in the future if further
  // caching is necessary. Definitely overkill for now.
  return cacheData(
    `${latitude}-${longitude}`,
    async () => {
      // Uses hours instead of days because AirTable's rounding for days is too
      // lenient and some display as "4 days ago" on frontend.
      const allAvailability = (await Airtable.base("appdsheneg5ii1EnQ")("Locations").select({
        filterByFormula: `
          AND(
            {Latest report},
            DATETIME_DIFF(TODAY(), {Latest report}, 'hours') <= ${OUTDATED_DAYS_THRESHOLD * 24},
            {Latitude},
            {Longitude},
            NOT({Vaccines available?} = 'No')
          )
        `,
        sort: [
          {
            field: "Latest report",
            direction: "desc",
          },
        ]
      }).all())
          .map((record) => record._rawJson);

      for (let i = 0; i < allAvailability.length; i++) {
        allAvailability[i].availabilityStatus = getAvailabilityStatus(
          allAvailability[i].fields["Vaccines available?"]
        );
      }
      
      const start = {latitude, longitude};
      for (let i = 0; i < allAvailability.length; i++) {
        allAvailability[i].distanceMiles = haversine(start, {
            latitude: allAvailability[i].fields.Latitude,
            longitude: allAvailability[i].fields.Longitude,
          },
          { unit: 'mile' },
        );
      }
      
      const locationDistanceBuckets = [];
      for (let i = 0; i < LOCATION_MILE_THRESHOLDS.length; i++) {
        let locationsWithinBucket;
        if (i == 0) {
          locationsWithinBucket = allAvailability.filter((location) => location.distanceMiles <= LOCATION_MILE_THRESHOLDS[i]);
        } else {
          locationsWithinBucket = allAvailability.filter((location) => 
              location.distanceMiles <= LOCATION_MILE_THRESHOLDS[i] && location.distanceMiles > LOCATION_MILE_THRESHOLDS[i - 1]);
        }

        locationDistanceBuckets.push({
          mileThreshold: LOCATION_MILE_THRESHOLDS[i],
          locations: {
            availableWaitlist: locationsWithinBucket.filter(
              (location) =>
                location.availabilityStatus.value ===
                AVAILABILITY_STATUS.WAITLIST.value
            ),
            availableAppointment: locationsWithinBucket.filter(
              (location) =>
                location.availabilityStatus.value ===
                AVAILABILITY_STATUS.APPOINTMENT.value
            ),
            availableWalkIn: locationsWithinBucket.filter(
              (location) =>
                location.availabilityStatus.value ===
                AVAILABILITY_STATUS.WALK_IN.value
            ),
          },
        });
      }

      return locationDistanceBuckets;
    }
  );
}