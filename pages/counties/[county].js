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

export default function CountyPage({ county, locations }) {
  const locationGroups = [
    {
      messageIcon: <FaCheckCircle />,
      message: "Vaccines reported available",
      messageColor: "text-success",
      locations: locations.availableWalkIn,
    },
    {
      messageIcon: <FaCheckCircle />,
      message: "Vaccines reported available with appointment",
      messageColor: "text-success",
      locations: locations.availableAppointment,
    },
    {
      messageIcon: <FaClipboardList />,
      message: "Vaccine waitlist signup reported available",
      messageColor: "text-info",
      locations: locations.availableWaitlist,
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
        <h1>{county} COVID-19 Vaccine Availability</h1>
        <p>
          As of January 19th, 2021, Pennsylvania has approved giving the
          COVID-19 vaccine to people age 65 and older. We are a volunteer team
          calling hospitals and pharmacies to identify which facilities are
          currently administering vaccines. This website will be updated daily
          to reflect the latest information we are able to gather.
        </p>
        <p>
          Follow us on <a href="https://twitter.com/VaccinatePA">Twitter</a> and
          like us on <a href="https://www.facebook.com/vaccinatepa">Facebook</a>{" "}
          for more information.
        </p>
        <p className="mt-4 alert alert-secondary text-center">
          <b>
            We appreciate your patience as we are rapidly adding more volunteers
            to help us update information on this site.
          </b>{" "}
          The site will be updated daily as we gather more information. If you
          would like to help volunteer to obtain updated vaccine availability
          information, please{" "}
          <a
            href="https://forms.gle/5vyDk2tTjYUTMTXu6"
            target="_blank"
            rel="noreferrer"
          >
            sign up to volunteer here
          </a>
          .
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
          {locationGroups.map((locationGroup) =>
            locationGroup.locations.length > 0 ? (
              <>
                <h4
                  className={
                    locationGroup.messageColor + " font-weight-bold mt-3"
                  }
                >
                  {locationGroup.messageIcon}{" "}
                  <span className="align-middle">{locationGroup.message}</span>
                </h4>
                {locationGroup.locations.map((location) => (
                  <div key={location.id} className="my-1">
                    <AirTableCard location={location} />
                  </div>
                ))}
              </>
            ) : null
          )}
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
