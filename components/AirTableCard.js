import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { AVAILABILITY_STATUS } from "../utils/Data";
import moment from "moment";

export default function AirTableCard({ location }) {
  const { Name, County, Address } = location.fields;

  const phoneNumber = location.fields["Phone number"];

  const latestReportTimeRaw = location.fields["Latest report"];
  const latestReportTimeText = latestReportTimeRaw
    ? moment(latestReportTimeRaw).fromNow()
    : null;

  const reportNoteList = location.fields["Latest report notes"];
  const reportNotes =
    reportNoteList && reportNoteList[0] ? reportNoteList[0].trim() : "";

  const availabilityStatus = location.availabilityStatus;
  let availabilityTag;
  if (availabilityStatus.value === AVAILABILITY_STATUS.UNKNOWN.value) {
    availabilityTag = (
      <span className="text-dark font-weight-bold">
        <FaQuestionCircle size="1.25em" className="mr-1" />{" "}
        <span className="align-middle">No confirmation / unknown</span>
      </span>
    );
  } else if (availabilityStatus.isAvailable) {
    availabilityTag = (
      <span className="text-success font-weight-bold">
        <FaCheckCircle size="1.25em" className="mr-1" />{" "}
        <span className="align-middle">
          Vaccines available ({availabilityStatus.display})
        </span>
      </span>
    );
  } else {
    availabilityTag = (
      <span className="text-danger font-weight-bold">
        <FaTimesCircle size="1.25em" className="mr-1" />{" "}
        <span className="align-middle">Vaccines not available</span>
      </span>
    );
  }

  return (
    <>
      <div className="location-card card">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="row">
              <div className="col-sm-8 col-md-10">
                <h5 className="mb-0 card-title text-truncate">{Name}</h5>
                <p className="my-0 text-truncate">
                  <a href={`tel:${phoneNumber}`}>
                    <small>{phoneNumber}</small>
                  </a>
                  <span className="text-muted">{" | "}</span>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      Address
                    )}`}
                  >
                    <small>{Address}</small>
                  </a>
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
          <li className="list-group-item">{availabilityTag}</li>
          {reportNotes.length > 0 ? (
            <li className="list-group-item">
              <span className="text-black">
                <BsInfoCircle size="1.25em" className="mr-1" />{" "}
                <span className="align-middle">
                  <span className="font-weight-bold">Latest info:</span>{" "}
                  {reportNotes}
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
