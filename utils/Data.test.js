import nock from "nock";
import Airtable from "airtable";
import { getCountyLinks, getCountyLocations } from "./Data";
import mockLocations from "../test/mockLocations.json";
import mockCountyLinks from "../test/mockCountyLinks.json";

const MOCK_AIRTABLE_URL = 'https://mock-airtable.com';
Airtable.endpointUrl = MOCK_AIRTABLE_URL;

describe("AirTable county location utility", () => {
  test('receives county location data', async () => {
    nock(MOCK_AIRTABLE_URL)
      .get(/.*Locations.*/)
      .reply(200, mockLocations);
    
    // TODO : Add a more fine-grained test beyond just not null.
    await expect(getCountyLocations("Bucks County")).resolves.not.toBeNull();
  });

  test('throws error when location data cannot be fetched', async () => {
    nock(MOCK_AIRTABLE_URL)
      .get(/.*Locations.*/)
      .reply(529);

    await expect(async () => await getCountyLocations("Bucks County")).rejects;
  });

  test('uses backup cache when location data cannot be fetched', async () => {
    nock(MOCK_AIRTABLE_URL)
      .get(/.*Locations.*/)
      .reply(200, mockLocations);
    
    const locations = await getCountyLocations("Bucks County");

    nock(MOCK_AIRTABLE_URL)
      .get(/.*Locations.*/)
      .reply(529);
    
    await expect(getCountyLocations("Bucks County")).resolves.toEqual(locations);
  })
});

describe("AirTable county links utility", () => {
  test('receives county link data', async () => {
    nock(MOCK_AIRTABLE_URL)
      .get(/.*Counties.*/)
      .reply(200, mockCountyLinks);
    
    // TODO : Add a more fine-grained test beyond just not null.
    await expect(getCountyLinks("Bucks County")).resolves.not.toBeNull();
  });

  test('throws error when county link data cannot be fetched', async () => {
    nock(MOCK_AIRTABLE_URL)
      .get(/.*Counties.*/)
      .reply(529);

    await expect(async () => await getCountyLinks("Bucks County")).rejects;
  });

  test('uses backup cache when county link data cannot be fetched', async () => {
    nock(MOCK_AIRTABLE_URL)
      .get(/.*Counties.*/)
      .reply(200, mockCountyLinks);
    
    const countyLinks = await getCountyLinks("Bucks County");

    nock(MOCK_AIRTABLE_URL)
      .get(/.*Counties.*/)
      .reply(529);

    await expect(getCountyLinks("Bucks County")).resolves.toEqual(countyLinks);
  })
});
