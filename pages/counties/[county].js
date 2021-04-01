import { useState } from "react";
import counties from "../../content/counties";
import { StandardLocationGroups } from "../../components/LocationGroups";
import CountyPageLayout from "../../layouts/CountyPageLayout";
import { getCountyLocations, getCountyLinks } from "../../utils/Data";
import { FaArrowLeft, FaExternalLinkAlt, FaRegClock } from "react-icons/fa";
import moment from "moment";
import Link from "next/link";
import TranslationOptions from "../../components/TranslationOptions";
import ClientSideOnly from "../../components/ClientSideOnly";
import RealtimeLocations from "../../components/RealtimeLocations";
import { Button } from "react-bootstrap";
import DataAnnouncements from "../../components/DataAnnouncements";

function countyToCountyCode(county) {
  return county.split(" ")[0].toLowerCase();
}

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
    <small>
      {countyCovidInfoLink ? (
        <p className="county-link mb-2">
          <a target="_blank" rel="noreferrer" href={countyCovidInfoLink}>
            Official {countyLinks.County}{" "}
            <span className="text-nowrap">
              Information <FaExternalLinkAlt size=".85em" />
            </span>
          </a>
        </p>
      ) : null}
      {countyPreregistrationLink ? (
        <p className="county-link mb-2">
          <a target="_blank" rel="noreferrer" href={countyPreregistrationLink}>
            Official {countyLinks.County} Vaccine{" "}
            <span className="text-nowrap">
              Preregistration <FaExternalLinkAlt size=".85em" />
            </span>
          </a>
        </p>
      ) : null}
      <p className="county-link mb-2">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://airtable.com/shr7z01kc7h1ogP5R"
        >
          Report missing or incorrect{" "}
          <span className="text-nowrap">
            information <FaExternalLinkAlt size=".85em" />
          </span>
        </a>
      </p>
      <style jsx>{`
        .county-link {
          line-height: 115%;
        }
      `}</style>
    </small>
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
        <FaRegClock size="1.00em" />{" "}
        <span className="align-middle">
          Latest county report received {latestReportTime.fromNow()}
        </span>
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
      <CountyPageLayout county={county}>
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

  const sharethisConfig = {
    alignment: "center",
    labels: "cta",
    color: "white",
    enabled: true,
    networks: ["facebook", "twitter", "reddit", "email", "sms"],
    radius: 4,
    size: 32,
    description: `${county} COVID-19 Vaccine Availability`,
    subject: "VaccinatePA: Find COVID-19 Vaccine Availability",
    message: `Find ${county} and more COVID-19 vaccine availability here.`,
    username: "VaccinatePA",
  };

  const latestReportedLocation =
    locations.allLocations.length > 0 ? locations.allLocations[0] : null;

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
        <h1 className="mb-3 d-none d-sm-block">
          {county} COVID-19 Vaccine Availability
        </h1>
        <h2 className="mb-3 d-block d-sm-none">
          {county} COVID-19 Vaccine Availability
        </h2>
        <div className="mb-4 row justify-content-between">
          <div className="col-12 col-md-auto">
            <LatestReportsReceived
              latestRealtimeReport={latestRealtimeReport}
              latestReportedLocation={latestReportedLocation}
            />
          </div>
          <div className="col-12 col-md-auto text-md-right mt-2 mt-md-0">
            <CountyLinks countyLinks={countyLinks} />
          </div>
        </div>
        <DataAnnouncements sharethisConfig={sharethisConfig} />
        <ClientSideOnly>
          <RealtimeLocations
            updateLatestReportTime={(latestRealtimeReport) =>
              setLatestRealtimeReport(latestRealtimeReport)
            }
            apiURL={`/api/realtime/counties/${countyToCountyCode(county)}`}
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
          <StandardLocationGroups locations={locations} />
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
