import AirTableCard from "../../components/AirTableCard";
import counties from "../../content/counties";
import Layout from "../../layouts/Layout";
import { getCountyLocations } from "../../utils/Data";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaArrowLeft,
  FaClipboardList,
} from "react-icons/fa";
import Link from "next/link";

function titleCase(str) {
  return str.replace(/(^|\s)\S/g, function (t) {
    return t.toUpperCase();
  });
}

function LocationGroup({ locationGroup }) {
  return locationGroup.locations.length > 0 ? (
    <div>
      <h4 className={locationGroup.messageColor + " font-weight-bold mt-3"}>
        {locationGroup.messageIcon}{" "}
        <span className="align-middle">{locationGroup.message}</span>
      </h4>
      {locationGroup.locations.map((location) => (
        <div key={location.id} className="my-1">
          <AirTableCard location={location} />
        </div>
      ))}
    </div>
  ) : null;
}

export default function CountyPage({ county, locations }) {
  const recentLocationGroups = [
    {
      messageIcon: <FaCheckCircle />,
      message: "Vaccines reported available",
      messageColor: "text-success",
      locations: locations.recentLocations.availableWalkIn,
    },
    {
      messageIcon: <FaCheckCircle />,
      message: "Vaccines reported available with appointment",
      messageColor: "text-success",
      locations: locations.recentLocations.availableAppointment,
    },
    {
      messageIcon: <FaClipboardList />,
      message: "Vaccine waitlist signup reported available",
      messageColor: "text-info",
      locations: locations.recentLocations.availableWaitlist,
    },
  ];

  const outdatedLocationGroups = [
    {
      messageIcon: <FaCheckCircle />,
      message: "Vaccines reported available",
      messageColor: "text-success",
      locations: locations.outdatedLocations.availableWalkIn,
    },
    {
      messageIcon: <FaCheckCircle />,
      message: "Vaccines reported available with appointment",
      messageColor: "text-success",
      locations: locations.outdatedLocations.availableAppointment,
    },
    {
      messageIcon: <FaClipboardList />,
      message: "Vaccine waitlist signup reported available",
      messageColor: "text-info",
      locations: locations.outdatedLocations.availableWaitlist,
    },
    {
      messageIcon: <FaQuestionCircle />,
      message: "Availability varies / no confirmation",
      messageColor: "text-black",
      locations: locations.noConfirmation,
    },
    {
      messageIcon: <FaTimesCircle />,
      message: "Vaccines reported unavailable",
      messageColor: "text-danger",
      locations: locations.noAvailability,
    },
    {
      messageIcon: <FaQuestionCircle />,
      message: "Uncontacted",
      messageColor: "text-dark",
      locations: locations.noConfirmationUncontacted,
    },
  ];

  return (
    <Layout title={county + " Vaccine Availability"}>
      <div className="container-fluid mt-3">
        <div className="ml-1 mb-2">
          <Link href="/">
            <a>
              <FaArrowLeft />{" "}
              <span className="align-middle">View all counties</span>
            </a>
          </Link>
        </div>
        <h1 className="mb-4">{county} COVID-19 Vaccine Availability</h1>
        <p>
          We are a volunteer team calling hospitals and pharmacies to identify
          which facilities are currently administering vaccines. This website
          will be updated daily to reflect the latest information we are able to
          gather.
        </p>
        <p>
          Follow us on <a href="https://twitter.com/VaccinatePA">Twitter</a> and
          like us on <a href="https://www.facebook.com/vaccinatepa">Facebook</a>{" "}
          for more information.
        </p>
        <p>
          Interested in volunteering? Please{" "}
          <a href="https://forms.gle/5vyDk2tTjYUTMTXu6">
            sign up to volunteer here
          </a>
          , and we will reach out to you.
        </p>
        <p className="alert alert-secondary text-center">
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
        <div className="d-flex flex-column">
          {locations.allLocations.length <= 0 ? (
            <>
              <h2 className="text-center mt-5">
                We currently have no locations for {county} on record.
              </h2>
              <h2 className="text-center">
                You can view all counties <Link href="/">here</Link>.
              </h2>
            </>
          ) : null}
          {recentLocationGroups.some(
            (locationGroup) => locationGroup.locations.length > 0
          ) ? (
            <>
              <h4 className="mb-0 font-weight-normal">
                <u>Recent availability:</u>
              </h4>
              {recentLocationGroups.map((locationGroup) => (
                <LocationGroup
                  key={locationGroup.message}
                  locationGroup={locationGroup}
                />
              ))}
            </>
          ) : null}
          {outdatedLocationGroups.some(
            (locationGroup) => locationGroup.locations.length > 0
          ) ? (
            <>
              <h4 className="mt-4 mb-0 font-weight-normal">
                <u>All reports:</u>
              </h4>
              {outdatedLocationGroups.map((locationGroup) => (
                <LocationGroup
                  key={locationGroup.message}
                  locationGroup={locationGroup}
                />
              ))}
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const countyDecoded = titleCase(params.county.replace("_", " "));
  if (!counties.includes(countyDecoded)) {
    return {
      notFound: true,
    };
  }

  const countyLocations = await getCountyLocations(countyDecoded);

  return {
    props: {
      county: countyDecoded,
      locations: countyLocations,
    },
  };
}
