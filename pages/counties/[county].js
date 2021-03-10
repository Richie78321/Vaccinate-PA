import { useState } from "react";
import AirTableCard from "../../components/AirTableCard";
import counties from "../../content/counties";
import CountyPageLayout from "../../layouts/CountyPageLayout";
import { getCountyLocations, getCountyLinks } from "../../utils/Data";
import {
  FaWalking,
  FaCalendarAlt,
  FaTimesCircle,
  FaQuestionCircle,
  FaArrowLeft,
  FaClipboardList,
  FaExternalLinkAlt,
} from "react-icons/fa";
import moment from "moment";
import Link from "next/link";
import TranslationOptions from "../../components/TranslationOptions";
import ClientSideOnly from "../../components/ClientSideOnly";
import RealtimeCountyLocations from "../../components/RealtimeCountyLocations";
import { Button } from "react-bootstrap";

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
        <div key={location.id} className="my-3">
          <AirTableCard location={location} />
        </div>
      ))}
    </div>
  ) : null;
}

const CountyLinks = ({ countyLinks }) => {
  let countyCovidInfoLink = countyLinks["County COVID Information"]
    ? countyLinks["County COVID Information"].trim()
    : null;
  if (countyCovidInfoLink && countyCovidInfoLink.length <= 0) {
    countyCovidInfoLink = countyCovidInfoLink.trim();
  }

  let countyPreregistrationLink = countyLinks["County COVID Preregistration"]
    ? countyLinks["County COVID Preregistration"].trim()
    : null;
  if (countyPreregistrationLink && countyPreregistrationLink.length <= 0) {
    countyPreregistrationLink = null;
  }

  return (
    <ul className="pl-4">
      {countyCovidInfoLink ? (
        <li>
          <a target="_blank" rel="noreferrer" href={countyCovidInfoLink}>
            Official {countyLinks.County} COVID-19{" "}
            <span className="text-nowrap">
              Information <FaExternalLinkAlt size=".85em" />
            </span>
          </a>
        </li>
      ) : null}
      {countyPreregistrationLink ? (
        <li>
          <a target="_blank" rel="noreferrer" href={countyPreregistrationLink}>
            Official {countyLinks.County} Vaccine{" "}
            <span className="text-nowrap">
              Preregistration <FaExternalLinkAlt size=".85em" />
            </span>
          </a>
        </li>
      ) : null}
    </ul>
  );
};

function LatestReportsReceived({
  latestRealtimeReport,
  latestReportedLocation,
}) {
  if (latestReportedLocation) {
    let latestReportTime = moment(
      latestReportedLocation.fields["Latest report"]
    );

    if (latestRealtimeReport) {
      const latestRealtimeReportTime = moment(latestRealtimeReport);
      if (latestRealtimeReportTime.isAfter(latestReportTime)) {
        latestReportTime = latestRealtimeReportTime;
      }
    }

    return (
      <span
        className="badge badge-primary font-weight-normal text-wrap"
        style={{ fontSize: "100%" }}
      >
        Latest report for county received {latestReportTime.fromNow()}
      </span>
    );
  }

  return null;
}

export default function CountyPage({ county, countyLinks, locations, error }) {
  // This might be smelly. Using to avoid spilling realtime data
  // fetching into an otherwise SSR component.
  const [latestRealtimeReport, setLatestRealtimeReport] = useState(null);

  if (error) {
    return (
      <CountyPageLayout>
        <div className="text-center">
          <h1 className="mt-5">We are currently experiencing an outage.</h1>
          <p>This normally only lasts a few minutes. Please check back soon!</p>
          <Link href="/">
            <Button variant="warning" className="rounded-pill my-2">
              Go Back Home
            </Button>
          </Link>
        </div>
      </CountyPageLayout>
    );
  }

  const latestReportedLocation =
    locations.allLocations.length > 0 ? locations.allLocations[0] : null;

  const recentLocationGroups = [
    {
      messageIcon: <FaWalking />,
      message: "Vaccines reported available walk-in",
      messageColor: "text-success",
      locations: locations.recentLocations.availableWalkIn,
    },
    {
      messageIcon: <FaCalendarAlt />,
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
      messageIcon: <FaWalking />,
      message: "Vaccines reported available walk-in",
      messageColor: "text-success",
      locations: locations.outdatedLocations.availableWalkIn,
    },
    {
      messageIcon: <FaCalendarAlt />,
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
      message: "Availability varies",
      messageColor: "text-dark",
      locations: locations.availabilityVaries,
    },
    {
      messageIcon: <FaTimesCircle />,
      message: "Vaccines reported unavailable",
      messageColor: "text-danger",
      locations: locations.noAvailability,
    },
    {
      messageIcon: <FaQuestionCircle />,
      message: "No confirmation / uncontacted",
      messageColor: "text-dark",
      locations: locations.noConfirmation,
    },
  ];

  return (
    <CountyPageLayout county={county}>
      <div className="container-fluid container-xl mt-3">
        <div className="ml-1 mb-2">
          <Link href="/">
            <a>
              <FaArrowLeft />{" "}
              <span className="align-middle">View all counties</span>
            </a>
          </Link>
          <div className="float-right">
            <TranslationOptions />
          </div>
        </div>
        <h1 className="mb-3">{county} COVID-19 Vaccine Availability</h1>
        <div className="mb-5">
          <LatestReportsReceived
            latestRealtimeReport={latestRealtimeReport}
            latestReportedLocation={latestReportedLocation}
          />
          <div className="mt-2">
            <CountyLinks countyLinks={countyLinks} />
          </div>
        </div>
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
        <ClientSideOnly>
          <RealtimeCountyLocations
            updateLatestReportTime={(latestRealtimeReport) =>
              setLatestRealtimeReport(latestRealtimeReport)
            }
            county={county}
          />
        </ClientSideOnly>
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
              <h3 className="mb-0 font-weight-normal">
                <u>Recent availability:</u>
              </h3>
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
              <h3 className="mt-4 mb-0 font-weight-normal">
                <u>All reports:</u>
              </h3>
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
    </CountyPageLayout>
  );
}

export async function getServerSideProps({ params }) {
  const countyDecoded = titleCase(params.county.replace("_", " "));
  if (!counties.includes(countyDecoded)) {
    return {
      notFound: true,
    };
  }

  try {
    var [countyLocations, countyLinks] = await Promise.all([
      getCountyLocations(countyDecoded),
      getCountyLinks(countyDecoded),
    ]);
  } catch (error) {
    console.error(error);
    return {
      props: {
        county: countyDecoded,
        error: true,
      },
    };
  }

  return {
    props: {
      county: countyDecoded,
      countyLinks: countyLinks,
      locations: countyLocations,
    },
  };
}
