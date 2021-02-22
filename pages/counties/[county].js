import LocationGroupCategories from "../../components/LocationGroupCategories";
import counties from "../../content/counties";
import CountyPageLayout from "../../layouts/CountyPageLayout";
import { getCountyLocations, getCountyLinks } from "../../utils/Data";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaArrowLeft,
  FaClipboardList,
  FaExternalLinkAlt,
} from "react-icons/fa";
import moment from "moment";
import Link from "next/link";

function titleCase(str) {
  return str.replace(/(^|\s)\S/g, function (t) {
    return t.toUpperCase();
  });
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

function LatestReportsReceived({ latestReportedLocation }) {
  if (latestReportedLocation) {
    const latestReportTimeRaw = latestReportedLocation.fields["Latest report"];
    if (latestReportTimeRaw) {
      return (
        <span
          className="badge badge-primary font-weight-normal text-wrap"
          style={{ fontSize: "100%" }}
        >
          Latest report for county received{" "}
          {moment(latestReportTimeRaw).fromNow()}
        </span>
      );
    }
  }

  return null;
}

export default function CountyPage({ county, countyLinks, locations }) {
  const latestReportedLocation =
    locations.allLocations.length > 0 ? locations.allLocations[0] : null;

  const locationGroupCategories = [
    {
      categoryTitle: "Recent availability",
      locationGroups: [
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
      ],
    },
    {
      categoryTitle: "All reports",
      locationGroups: [
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
      ],
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
        </div>
        <h1 className="mb-3">{county} COVID-19 Vaccine Availability</h1>
        <div className="mb-5">
          <LatestReportsReceived
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
        <LocationGroupCategories
          locationGroupCategories={locationGroupCategories}
        />
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

  const countyLocations = await getCountyLocations(countyDecoded);
  const countyLinks = await getCountyLinks(countyDecoded);

  return {
    props: {
      county: countyDecoded,
      countyLinks: countyLinks,
      locations: countyLocations,
    },
  };
}
