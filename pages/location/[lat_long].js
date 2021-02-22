import LocationGroupCategories from "../../components/LocationGroupCategories";
import Layout from "../../layouts/Layout";
import Link from "next/link";
import { getLatLongLocations } from "../../utils/Data";
import {
  FaCheckCircle,
  FaClipboardList,
  FaArrowLeft,
} from "react-icons/fa";

export default function LatLongPage({ latitude, longitude, locationDistanceBuckets }) {
  const locationGroupCategories = locationDistanceBuckets.map((locationDistanceBucket) => ({
    categoryTitle: `Recent availability within ${locationDistanceBucket.mileThreshold} miles`,
    locationGroups: [
      {
        messageIcon: <FaCheckCircle />,
        message: "Vaccines reported available",
        messageColor: "text-success",
        locations: locationDistanceBucket.locations.availableWalkIn,
      },
      {
        messageIcon: <FaCheckCircle />,
        message: "Vaccines reported available with appointment",
        messageColor: "text-success",
        locations: locationDistanceBucket.locations.availableAppointment,
      },
      {
        messageIcon: <FaClipboardList />,
        message: "Vaccine waitlist signup reported available",
        messageColor: "text-info",
        locations: locationDistanceBucket.locations.availableWaitlist,
      },
    ],
  }));
  
  return (
    <Layout title="Vaccine Availability by Location">
      <div className="container-fluid container-xl mt-3">
        <div className="ml-1 mb-2">
          <Link href="/">
            <a>
              <FaArrowLeft />{" "}
              <span className="align-middle">View all locations</span>
            </a>
          </Link>
        </div>
        <h1 className="mb-5">COVID-19 Vaccine Availability by Location</h1>
        <p className="alert alert-light text-center mb-3 border">
          If you have a missing location to report, or think we have incorrect
          information,{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://airtable.com/shr7z01kc7h1ogP5R"
          >
            please let us know.
          </a>
        </p>
        <LocationGroupCategories locationGroupCategories={locationGroupCategories} />
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  // TODO : Consider better way to handle invalid lat-long input than 404.
  const latLongSplit = params.lat_long.split("_");
  if (latLongSplit.length != 2) {
    return {
      notFound: true,
    };
  }

  const latitude = parseFloat(latLongSplit[0]);
  const longitude = parseFloat(latLongSplit[1]);

  if (isNaN(latitude) || isNaN(longitude)) {
    return {
      notFound: true,
    };
  }
  
  const locationDistanceBuckets = await getLatLongLocations(latitude, longitude);

  return {
    props: {
      latitude,
      longitude,
      locationDistanceBuckets,
    }
  };
}
