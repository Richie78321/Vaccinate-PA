import {
  FaWalking,
  FaCalendarAlt,
  FaTimesCircle,
  FaQuestionCircle,
  FaClipboardList,
  FaExternalLinkAlt,
  FaStar,
} from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { AVAILABILITY_STATUS } from "../utils/DataLocal";
import moment from "moment";
import NotesParser from "./NotesParser";

// const displayPhoneNumber = (phone) => {
//   if (!phone) {
//     return "N/A";
//   } else {
//     var cleaned = ("" + phone).replace(/\D/g, "");
//     var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
//     if (match) {
//       return "(" + match[1] + ") " + match[2] + "-" + match[3];
//     } else {
//       return phone;
//     }
//   }
// };

function formatWebsite(website) {
  let websiteFormatted = website.trim();

  // Ensure the website has a protocol defined (otherwise redirects to local page)
  // https://stackoverflow.com/questions/3543187/prepending-http-to-a-url-that-doesnt-already-contain-http
  if (
    websiteFormatted.indexOf("://") === -1 &&
    websiteFormatted.indexOf("mailto:") === -1
  ) {
    websiteFormatted = "http://" + websiteFormatted;
  }

  return websiteFormatted;
}

function RequirementTag({
  requirementList,
  beforeLabel,
  pluralBeforeLabel,
  afterLabel,
  pluralAfterLabel,
}) {
  const requirementString = requirementList.join(", ").trim();

  let endLabel;
  if (afterLabel) {
    endLabel =
      pluralAfterLabel && requirementList.length > 1
        ? pluralAfterLabel
        : afterLabel;
  } else {
    endLabel = null;
  }

  let beginningLabel;
  if (beforeLabel) {
    beginningLabel =
      pluralBeforeLabel && requirementList.length > 1
        ? pluralBeforeLabel
        : beforeLabel;
  } else {
    beginningLabel = null;
  }

  return (
    <div className="col-md-4 col-12 px-3 py-2 d-flex align-items-center">
      {beginningLabel} {requirementString} {endLabel}
    </div>
  );
}

function AvailabilityTag({ availabilityStatus, numReports }) {
  // TODO : Fix this ugly if-else block that I don't have time to address right now.
  switch (availabilityStatus.value) {
    case AVAILABILITY_STATUS.WALK_IN.value:
      return (
        <span className="text-success font-weight-bold">
          <FaWalking size="1.25em" className="mr-1" />{" "}
          <span className="align-middle">Vaccines available walk-in</span>
        </span>
      );
    case AVAILABILITY_STATUS.APPOINTMENT.value:
      return (
        <span className="text-success font-weight-bold">
          <FaCalendarAlt size="1.25em" className="mr-1" />{" "}
          <span className="align-middle">
            Vaccines available with appointment
          </span>
        </span>
      );
    case AVAILABILITY_STATUS.WAITLIST.value:
      return (
        <span className="text-info font-weight-bold">
          <FaClipboardList size="1.25em" className="mr-1" />{" "}
          <span className="align-middle">
            Vaccine waitlist signup available
          </span>
        </span>
      );
    case AVAILABILITY_STATUS.NO.value:
      return (
        <span className="text-danger font-weight-bold">
          <FaTimesCircle size="1.25em" className="mr-1" />{" "}
          <span className="align-middle">Vaccines not available</span>
        </span>
      );
    case AVAILABILITY_STATUS.VARIES.value:
      return (
        <span className="text-dark font-weight-bold">
          <FaQuestionCircle size="1.25em" className="mr-1" />{" "}
          <span className="align-middle">Availability varies</span>
        </span>
      );
    default:
      return (
        <span className="text-dark font-weight-bold">
          <FaQuestionCircle size="1.25em" className="mr-1" />{" "}
          <span className="align-middle">
            {numReports > 0 ? "No confirmation" : "Uncontacted"}
          </span>
        </span>
      );
  }
}

export default function AirTableCard({ location }) {
  const { Name, County } = location.fields;

  // const phoneNumber = location.fields["Phone number"];
  const distanceMiles = location.distanceMiles;

  const latestReportTimeRaw = location.fields["Latest report"];
  const latestReportTimeText = latestReportTimeRaw
    ? moment(latestReportTimeRaw).fromNow()
    : null;

  const addressTextRaw = location.fields["Address"];

  let address = addressTextRaw ? addressTextRaw.trim() : null;
  // Greater than 1 because AirTable populates empty addresses with a single comma.
  if (address.length <= 1) {
    address = null;
  }

  let website = location.fields["Website"]
    ? formatWebsite(location.fields["Website"])
    : null;

  const reportNoteList = location.fields["Latest report notes"];
  const reportNotes =
    reportNoteList && reportNoteList[0] ? reportNoteList[0].trim() : "";

  const availabilityStatus = location.availabilityStatus;
  const isActiveSupersite = location.isActiveSupersite;

  const requirements = [
    {
      requirementList: location.fields.age_requirement,
      afterLabel: "Only",
    },
    {
      requirementList: location.fields.occupation_requirement,
      afterLabel: "Only",
    },
    {
      requirementList: location.fields.eligible_counties,
      afterLabel: "County Only",
      pluralAfterLabel: "Counties Only",
    },
    {
      requirementList: location.fields.dose_type,
      beforeLabel: "Providing",
    },
    {
      requirementList: location.fields.eligible_phases,
      beforeLabel: "Phase",
      pluralBeforeLabel: "Phases",
      afterLabel: "Only",
    },
  ].filter(
    ({ requirementList }) => requirementList && requirementList.length > 0
  );

  return (
    <>
      <div
        className={
          isActiveSupersite
            ? "location-card card border-success"
            : "location-card card"
        }
      >
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="row">
              <div className="col-auto">
                {isActiveSupersite ? (
                  <h6 className="card-title text-success mb-2">
                    <FaStar size="1em" />{" "}
                    <span className="align-middle">Mass Vaccination Site</span>
                  </h6>
                ) : null}
                <h5 className="mb-0 card-title text-truncate">{Name}</h5>
                <p className="my-0 text-truncate">
                  {/* <a href={`tel:${phoneNumber}`}>
                    <small>{displayPhoneNumber(phoneNumber)}</small>
                  </a>*/}
                  {website ? (
                    <>
                      <a href={website} target="_blank" rel="noreferrer">
                        <small>
                          Visit Website <FaExternalLinkAlt size=".85em" />
                        </small>
                      </a>
                      <span className="text-muted d-none d-sm-inline">{" | "}</span>
                      <br className="d-block d-sm-none" />
                    </>
                  ) : null}
                  {distanceMiles ? (
                    <>
                      <small>~{Math.round(distanceMiles)} miles away</small>
                      <span className="text-muted">{" | "}</span>
                    </>
                  ) : null}
                  {address ? (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        address
                      )}`}
                    >
                      <small>{address}</small>
                    </a>
                  ) : null}
                </p>
              </div>
              {latestReportTimeText ? (
                <div className="ml-auto col-auto text-right">
                  <span className="badge badge-pill badge-light font-weight-normal text-wrap">
                    Updated {latestReportTimeText}
                  </span>
                </div>
              ) : null}
            </div>
          </li>
          <li className="list-group-item">
            <AvailabilityTag
              availabilityStatus={availabilityStatus}
              numReports={location.fields["Number of reports"]}
            />
          </li>
          {requirements.length > 0 ? (
            <li className="list-group-item py-0">
              <div className="row requirements">
                {requirements.map((requirement) => (
                  <RequirementTag
                    key={requirement.requirementList}
                    {...requirement}
                  />
                ))}
              </div>
            </li>
          ) : null}
          {reportNotes.length > 0 ? (
            <li className="list-group-item">
              <span className="text-black">
                <BsInfoCircle size="1.25em" className="mr-1" />{" "}
                <span className="align-middle">
                  <span className="font-weight-bold">Latest info:</span>{" "}
                  <NotesParser notes={reportNotes} />
                </span>
              </span>
            </li>
          ) : null}
        </ul>
      </div>
      <style jsx>{`
        .location-card {
          box-shadow: 1px 1px 20px 2px rgb(0 0 0 / 10%);
        }
      `}</style>
    </>
  );
}
