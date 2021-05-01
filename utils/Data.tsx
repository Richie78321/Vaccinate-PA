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
import { GoogleSpreadsheet } from "google-spreadsheet";
import zips from "../content/zips.json";
import moment from "moment";

const ARCHIVE_MODE = process.env.ARCHIVE_MODE === "true";

let dataArchiveSheet: Promise<any> = null;

if (ARCHIVE_MODE) {
  // Load data archive sheet. This takes time, so requests made to this sheet will go through
  // a promise so they must wait for the sheet to connect if it is not already.
  dataArchiveSheet = (async () => {
    const doc = new GoogleSpreadsheet(
      "1OcKiQOELgpVX_iZkbIHWPjN75qOaO6fmJCDkk8iGSQ4"
    );

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_API_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_API_KEY,
    });

    await doc.loadInfo();

    return doc;
  })();
} else {
  // @ts-ignore
  Airtable.configure({ apiKey: process.env.AIRTABLE_KEY });
}

const queryBackupCache = new NodeCache({
  deleteOnExpire: false,
  stdTTL: 0,
});
const queryCache = new NodeCache({
  stdTTL: 600, // Ten minutes
});

export async function cacheDataQuery(
  cacheKeyword: string,
  query: () => Promise<any>
): Promise<any> {
  let data = queryCache.get(cacheKeyword);
  if (data == undefined) {
    try {
      data = await query();

      queryCache.set(cacheKeyword, data);
      queryBackupCache.set(cacheKeyword, data);
    } catch (error) {
      console.error(error);

      // Attempt to load from backup cache.
      data = queryBackupCache.get(cacheKeyword);

      if (data == undefined) {
        throw error;
      } else {
        // Reset the main cache to backup.
        console.log("Setting cache to backup.");
        queryCache.set(cacheKeyword, data);
      }
    }
  }

  return data;
}

// Warning -- this is is a super sus function
function spreadsheetRowToAirtableMimic(spreadsheetRow) {
  // Filter out any keys that are private
  const airtableMimicFields = Object.keys(spreadsheetRow)
    .filter((key) => key.charAt(0) !== "_")
    .reduce((acc, key) => {
      acc[key] = spreadsheetRow[key];

      // The NextJS serializer doesn't like working with undefined values.
      if (acc[key] === undefined) {
        acc[key] = null;
      }

      return acc;
    }, {});

  return {
    id: spreadsheetRow.rowNumber,
    fields: airtableMimicFields,
  };
}

// TODO: Not ideal, should look to change this in the AirTable soon.
export function getAvailabilityStatus(
  vaccinesAvailableString: string[]
): AvailabilityStatus {
  if (vaccinesAvailableString && vaccinesAvailableString.length > 0) {
    for (let statusValue in AVAILABILITY_STATUS) {
      if (
        vaccinesAvailableString[0] === AVAILABILITY_STATUS[statusValue].string
      ) {
        return AVAILABILITY_STATUS[statusValue];
      }
    }

    console.log(
      `Encountered unknown availability status: '${vaccinesAvailableString[0]}'`
    );
  }

  return AVAILABILITY_STATUS.UNKNOWN;
}

export function getCountyLinks(county: string): Promise<CountyLinks> {
  return cacheDataQuery(`county-links-${county}`, async () => {
    let countyLinks;
    if (ARCHIVE_MODE) {
      countyLinks = (
        await (await dataArchiveSheet).sheetsByTitle["Counties"].getRows()
      ).map((row) => spreadsheetRowToAirtableMimic(row));
    } else {
      countyLinks = (
        await Airtable.base("appdsheneg5ii1EnQ")("Counties").select().all()
      ).map((record) => record._rawJson);
    }

    const countySpecificInfo = countyLinks.filter(
      (record) => record.fields.County === county
    );

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
  return cacheDataQuery("all", async () => {
    if (ARCHIVE_MODE) {
      let locations = (
        await (await dataArchiveSheet).sheetsByTitle["Locations"].getRows()
      )
        .map((row) => spreadsheetRowToAirtableMimic(row))
        .filter(
          (locations) => locations.fields["Do Not Display"] !== "checked"
        );

      // Sort array of locations by time
      const dsu = (arr1, arr2) =>
        arr1
          .map((item, index) => [arr2[index], item])
          .sort(([arg1], [arg2]) => arg2 - arg1)
          .map(([, item]) => item);

      locations = dsu(
        locations,
        locations.map((location) =>
          moment(location.fields["Latest report"], "M/D/YYYY h:m A")
        )
      );

      // A few fields are treated as arrays from AirTable, so must be mimicked here.
      locations.forEach((location) => {
        location.fields["Vaccines available?"] =
          location.fields["Vaccines available?"].length > 0
            ? [location.fields["Vaccines available?"]]
            : [];
        location.fields["Latest report notes"] =
          location.fields["Latest report notes"].length > 0
            ? [location.fields["Latest report notes"]]
            : [];
        location.fields["age_requirement"] =
          location.fields["age_requirement"].length > 0
            ? location.fields["age_requirement"].split(", ")
            : [];
        location.fields["occupation_requirement"] =
          location.fields["occupation_requirement"].length > 0
            ? location.fields["occupation_requirement"].split(", ")
            : [];
        location.fields["eligible_counties"] =
          location.fields["eligible_counties"].length > 0
            ? location.fields["eligible_counties"].split(", ")
            : [];
        location.fields["dose_type"] =
          location.fields["dose_type"].length > 0
            ? location.fields["dose_type"].split(", ")
            : [];
        location.fields["eligible_phases"] =
          location.fields["eligible_phases"].length > 0
            ? location.fields["eligible_phases"].split(", ")
            : [];
      });

      return locations;
    } else {
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
      ).map((record) => record._rawJson);
    }
  });
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
  const zipCode = zips[zip];

  if (!zipCode) {
    return null;
  }

  if (!zipCode.Latitude || !zipCode.Longitude) {
    return null;
  }

  return {
    lat: zipCode.Latitude,
    long: zipCode.Longitude,
  };
}

export function getCountyLocations(
  county: string
): Promise<OrganizedLocations> {
  return cacheDataQuery(county, async () => {
    let countyLocations: RawLocation[];

    if (ARCHIVE_MODE) {
      countyLocations = (await getAllLocations()).filter(
        (location) => location.fields["County"] === county
      );
    } else {
      countyLocations = (
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
    }

    const countyLocationsProcessed: Location[] = preprocessLocations(
      countyLocations
    );

    return organizeLocations(countyLocationsProcessed);
  });
}
