import Link from "next/link";
import Layout from "../../layouts/Layout";
import TranslationOptions from "../../components/TranslationOptions";
import NearbyLocations, {
  DEFAULT_DISTANCE_MILES,
} from "../../components/NearbyLocations";
import { getZipLatLong } from "../../utils/Data";
import { FaArrowLeft } from "react-icons/fa";
import ClientSideOnly from "../../components/ClientSideOnly";
import { Button } from "react-bootstrap";
import { getCountyCodeFromLatLong } from "../../utils/CountyLines";
import { getCountyLinks, getNearbyLocations } from "../../utils/Data";
import { getNearbyLocations as getNearbyLocationsRealtime } from "../../realtime-api/realtimeData";
import { organizeLocations } from "../../utils/DataLocal";

export default function ZipPage({
  zip,
  lat,
  long,
  countyLinks,
  nearbyLocations,
  nearbyRealtimeLocations,
  error,
}) {
  if (error) {
    return (
      <Layout title={`Vaccine Availability Near ${zip}`}>
        <div className="text-center">
          <h1 className="mt-5">We are currently experiencing an outage.</h1>
          <p>This normally only lasts a few minutes. Please check back soon!</p>
          <Link href="/">
            <Button variant="warning" className="rounded-pill my-2">
              Go Back Home
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const shareURL = `https://vaccinatepa.org/zips/${zip}`;

  const sharethisConfig = {
    alignment: "center",
    labels: "cta",
    color: "white",
    enabled: true,
    networks: ["facebook", "twitter", "reddit", "email", "sms"],
    radius: 4,
    size: 32,
    description: `COVID-19 Vaccine Availability Near You`,
    subject: "VaccinatePA: Find COVID-19 Vaccine Availability",
    message: `Find COVID-19 vaccine availability near ${zip} and more here: ${shareURL}`,
    username: "VaccinatePA",
    url: shareURL,
  };

  return (
    <Layout
      title={`Vaccine Availability Near ${zip}`}
      description={`Find Vaccine Availability near ${zip} and other ZIP codes`}
    >
      <div className="container-fluid container-xl mt-3">
        <div className="ml-1 mb-2">
          <Link href="/">
            <a>
              <FaArrowLeft />{" "}
              <span className="align-middle">View all ZIP codes</span>
            </a>
          </Link>
          <div className="float-right">
            <TranslationOptions />
          </div>
        </div>
        <h1 className="mb-3 d-none d-sm-block">
          COVID-19 Vaccine Availability Near {zip}
        </h1>
        <h2 className="mb-3 d-block d-sm-none">
          COVID-19 Vaccine Availability Near {zip}
        </h2>
        <NearbyLocations
          lat={lat}
          long={long}
          sharethisConfig={sharethisConfig}
          countyLinks={countyLinks}
          locations={nearbyLocations}
          preloadedRealtime={nearbyRealtimeLocations}
        />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const zip = params.zip;
  if (!zip) {
    return {
      notFound: true,
    };
  }

  try {
    var zipLatLong = await getZipLatLong(zip);
    // TODO : Consider better message than 404 on not found.
    if (!zipLatLong) {
      return {
        notFound: true,
      };
    }

    const countyCode = getCountyCodeFromLatLong([
      zipLatLong.long,
      zipLatLong.lat,
    ]);
    if (countyCode) {
      var [
        countyLinks,
        nearbyLocations,
        nearbyRealtimeLocations,
      ] = await Promise.all([
        getCountyLinks(
          countyCode.charAt(0).toUpperCase() + countyCode.slice(1) + " County"
        ),
        getNearbyLocations(
          zipLatLong.lat,
          zipLatLong.long,
          DEFAULT_DISTANCE_MILES
        ),
        getNearbyLocationsRealtime(
          zipLatLong.lat,
          zipLatLong.long,
          DEFAULT_DISTANCE_MILES
        ),
      ]);

      nearbyLocations = organizeLocations(nearbyLocations);
    }
  } catch (error) {
    console.error(error);
    return {
      props: {
        zip: zip,
        error: true,
      },
    };
  }

  return {
    props: {
      zip: zip,
      lat: zipLatLong.lat,
      long: zipLatLong.long,
      countyLinks: countyLinks,
      nearbyLocations,
      nearbyRealtimeLocations: {
        locations: nearbyRealtimeLocations,
        lastUpdated: new Date().toISOString(),
      },
    },
  };
}
