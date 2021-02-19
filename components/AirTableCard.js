import {
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaClipboardList,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { AVAILABILITY_STATUS } from "../utils/Data";
import moment from "moment";
import Linkify from "react-linkify";

const linkDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
);

const displayPhoneNumber = (phone) => {
  if (!phone) {
    return "N/A";
  } else {
    var cleaned = ("" + phone).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    } else {
      return phone;
    }
  }
};

const getCommaSeparatedList = (items) => {
  const lowercaseString = items.join(", ").trim().toLowerCase() + ' only';
  return lowercaseString[0].toUpperCase() + lowercaseString.slice(1);
}

// These are all multi selects, so they'll either be null (no data) or an array
const getOptionalAdditionalInfo = (additionalInfo) => {
  if (additionalInfo) {
    return getCommaSeparatedList(additionalInfo);
  } else {
    return null; 
  }
}

function AvailabilityTag({ availabilityStatus, numReports }) {
  // TODO : Fix this ugly if-else block that I don't have time to address right now.
  switch (availabilityStatus.value) {
    case AVAILABILITY_STATUS.WALK_IN.value:
      return (
        <span className="text-success font-weight-bold">
          <FaCheckCircle size="1.25em" className="mr-1" />{" "}
          <span className="align-middle">Vaccines available</span>
        </span>
      );
    case AVAILABILITY_STATUS.APPOINTMENT.value:
      return (
        <span className="text-success font-weight-bold">
          <FaCheckCircle size="1.25em" className="mr-1" />{" "}
          <span className="align-middle">
            Vaccines available (With Appointment)
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

  const website = location.fields["Website"]
    ? location.fields["Website"].trim()
    : null;

  const reportNoteList = location.fields["Latest report notes"];
  const reportNotes =
    reportNoteList && reportNoteList[0] ? reportNoteList[0].trim() : "";

  const availabilityStatus = location.availabilityStatus;

  const ageRequirement = getOptionalAdditionalInfo(location.fields.age_requirement);
  const occupationRequirement = getOptionalAdditionalInfo(location.fields.occupation_requirement);
  const countyRequirement = getOptionalAdditionalInfo(location.fields.eligible_counties);

  // TODO: We could order these so that they are always in the same spot (e.g. age | occupation | location )
  // but this would often mean empty sections on the left.
  // If we want the data to always flow left to right, we could choose to leave out the null values in the below array.
  // The tradeoff here is that data could end up in different locations depending on the specific card, which might
  // make things harder to scan.
  const allAdditionalRequirements = [ageRequirement, occupationRequirement, countyRequirement];
  const additionalRequirementsToDisplay = allAdditionalRequirements.filter((req) => req != null);

  return (
    <>
      <div className="location-card card">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="row">
              <div className="col-sm-8 col-md-10">
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
                <div className="col-sm-4 col-md-2 text-right">
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
          { additionalRequirementsToDisplay.length > 0 && (
            <li className="list-group-item py-0">
              <div className="row additional-requirements">
                {
                  additionalRequirementsToDisplay.map((req) => {
                    return (
                      <div className="col-md-4 col-12 px-3 py-2 d-flex align-items-center" key={req}>
                        {req}
                      </div>
                    );
                  })
                }
              </div>
            </li>
          ) }
          {reportNotes.length > 0 ? (
            <li className="list-group-item">
              <span className="text-black">
                <BsInfoCircle size="1.25em" className="mr-1" />{" "}
                <span className="align-middle">
                  <span className="font-weight-bold">Latest info:</span>{" "}
                  <Linkify componentDecorator={linkDecorator}>
                    {reportNotes}
                  </Linkify>
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
