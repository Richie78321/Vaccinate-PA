import { FaExternalLinkAlt } from "react-icons/fa";

export default function CountyInfoLinks({ countyLinks }) {
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
          href="https://docs.google.com/forms/d/e/1FAIpQLScUYnD_9b_wlG4UK2RPNHeXgYlaMTIW4sVzXo5Ow0PxqHLIEw/viewform?usp=sf_link"
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
}
