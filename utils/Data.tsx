import Airtable from "airtable";
import NodeCache from "node-cache";
import haversine from "haversine";
import {
  OrganizedLocations,
  Location,
  RawLocation,
  CountyLinks,
  AvailabilityStatus,
  ZipCode,
} from "./DataTypes";
import { organizeLocations, AVAILABILITY_STATUS } from "./DataLocal";

const airtableBackupCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 0,
});
const airtableCache = new NodeCache({
  stdTTL: 600, // Ten minutes
});

// @ts-ignore
Airtable.configure({ apiKey: process.env.AIRTABLE_KEY });

export async function fetchAirtableData(
  cacheKeyword: string,
  query: () => Promise<any>
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
  return fetchAirtableData(`county-links-${county}`, async () => {
    const countyLinks = await Airtable.base("appdsheneg5ii1EnQ")("Counties")
      .select()
      .all();

    const countySpecificInfo = countyLinks
      .map((record) => record._rawJson)
      .filter((record) => record.fields.County === county);

    if (countySpecificInfo.length > 0) {
      return countySpecificInfo[0].fields;
    } else {
      return {};
    }
  });
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

function getDistance(lat: number, long: number, location: RawLocation): number {
  return haversine(
    {
      latitude: lat,
      longitude: long,
    },
    {
      latitude: location.fields.Latitude,
      longitude: location.fields.Longitude,
    },
    { unit: "mile" }
  );
}

function getAllLocations(): Promise<RawLocation[]> {
  return fetchAirtableData(
    "all",
    async () => {
      return (
        await Airtable.base("appdsheneg5ii1EnQ")("Locations")
          .select({
            filterByFormula: `NOT({Do Not Display})`,
            sort: [
              {
                field: "Latest report",
                direction: "desc",
              },
            ],
          })
          .all()
      )
        .map((record) => record._rawJson)
    }
  );
}

export async function getAllLocationsPreprocessed(): Promise<Location[]> {
  return preprocessLocations(await getAllLocations());
} 

export async function getNearbyLocations(
  lat: number,
  long: number,
  distance: number
): Promise<Location[]> {
  let allLocations = await getAllLocations();
  allLocations = allLocations.filter(
    (location) => location.fields.Latitude && location.fields.Longitude
  );

  allLocations.forEach((location) => {
    location["distanceMiles"] =
      Math.floor(getDistance(lat, long, location) * 10) / 10;
  });

  const locationsWithinDistance: RawLocation[] = allLocations.filter(
    (location) => location["distanceMiles"] <= distance
  );

  return preprocessLocations(locationsWithinDistance);
}

export async function getZipLatLong(
  zip: string
): Promise<{ lat: number; long: number } | null> {
  const zipCodes: ZipCode[] = (await fetchAirtableData(zip, async () => {
    return (
      await Airtable.base("appdsheneg5ii1EnQ")("Zipcodes")
        .select({
          filterByFormula: `ZIP = ${zip}`,
        })
        .all()
    ).map((record) => record._rawJson);
  })) as ZipCode[];

  if (zipCodes.length <= 0) {
    return null;
  }

  const zipCode = zipCodes[0];
  if (!zipCode.fields.Latitude || !zipCode.fields.Longitude) {
    return null;
  }

  return {
    lat: zipCode.fields.Latitude,
    long: zipCode.fields.Longitude,
  };
}

export function getCountyLocations(
  county: string
): Promise<OrganizedLocations> {
  return fetchAirtableData(county, async () => {
    const countyLocations: RawLocation[] = (
      await Airtable.base("appdsheneg5ii1EnQ")("Locations")
        .select({
          filterByFormula: `AND(County = "${county}", NOT({Do Not Display}))`,
          sort: [
            {
              field: "Latest report",
              direction: "desc",
            },
          ],
        })
        .all()
    ).map((record) => record._rawJson);

    const countyLocationsProcessed: Location[] = preprocessLocations(
      countyLocations
    );

    return organizeLocations(countyLocationsProcessed);
  });
}
