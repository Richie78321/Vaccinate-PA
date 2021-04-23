import moment from "moment";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";

// Smelly af but works for now.
const brandInstructions = {
  walgreens: (location) => (
    <>
      <span className="text-nowrap">
        <a
          href="https://drive.google.com/file/d/1aZmz5lYQ2eh2PeALw1FrqPSJjOYJStK-/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
        >
          View More <FaExternalLinkAlt size=".75em" />
        </a>
      </span>
      {" | "}
      <ZipCodeInstructions location={location} />
    </>
  ),
  rite_aid: (location) => (
    <>
      <span className="text-nowrap">
        <a
          href="https://drive.google.com/file/d/1h2PRp_kNFGGuieq9KIAwIkGYB1ohJYP5/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
        >
          View More <FaExternalLinkAlt size=".75em" />
        </a>
      </span>
      {" | "}
      <ZipCodeInstructions location={location} />
    </>
  ),
  weis: (location) => (
    <>
      <span className="text-nowrap">
        <a
          href="https://drive.google.com/file/d/1L4gCp3cke2DmIiU-014GrGyhopre2L_M/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
        >
          View More <FaExternalLinkAlt size=".75em" />
        </a>
      </span>
      {" | "}
      <ZipCodeInstructions location={location} />
    </>
  ),
  wegmans: (location) => <ZipCodeInstructions location={location} />,
  walmart: (location) => <ZipCodeInstructions location={location} />,
};

function ZipCodeInstructions({ location }) {
  if (!location.properties.postal_code) {
    return null;
  }

  return (
    <span>
      Enter the zip code <b>{location.properties.postal_code}</b> when searching
      for appointments. Look for the location with a matching address.
    </span>
  );
}

// function toTitleCase(str) {
//   return str.replace(/(^|\s)\S/g, function (t) {
//     return t.toUpperCase();
//   });
// }

// function formatAppointment(appointment) {
//   if (appointment.types) {
//     appointment.types = appointment.types.map((type) =>
//       toTitleCase(type.split("_").join(" "))
//     );
//   }
// }

export default function RealtimeLocationCard({ location }) {
  const website = location?.properties?.url;
  const address = `${
    location.properties.address ? location.properties.address + ", " : ""
  } ${location.properties.city || ""} ${location.properties.postal_code || ""}`;
  const latestReportTimeText = location.properties.appointments_last_fetched
    ? moment(location.properties.appointments_last_fetched).fromNow()
    : null;
  const name = location.properties.provider_brand_name
    ? location.properties.provider_brand_name
    : location.properties.name;

  const appointments = location.properties.appointments;
  // if (appointments) {
  //   appointments.forEach((appointment) => {
  //     formatAppointment(appointment);
  //   });
  // }

  let instructions = null;
  if (
    location.properties.provider &&
    brandInstructions[location.properties.provider]
  ) {
    instructions = brandInstructions[location.properties.provider](location);
  }

  const distanceMiles = location.distanceMiles;

  return (
    <>
      <div className="location-card card">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="row">
              <div className="col-auto">
                <h5 className="mb-0 card-title text-truncate">{name}</h5>
                <p className="my-0 text-truncate">
                  {website ? (
                    <>
                      <a href={website} target="_blank" rel="noreferrer">
                        <small>
                          Schedule Appointment{" "}
                          <FaExternalLinkAlt size=".85em" />
                        </small>
                      </a>
                      <span className="text-muted d-none d-sm-inline">
                        {" | "}
                      </span>
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
            <span className="text-success font-weight-bold">
              <FaCalendarAlt size="1.25em" className="mr-1" />{" "}
              <span className="align-middle">
                Vaccines available with appointment
              </span>
            </span>
          </li>
          {instructions ? (
            <li className="list-group-item">
              <span className="text-black">
                <BsInfoCircle size="1.25em" className="mr-1" />{" "}
                <span className="align-middle">
                  <span className="font-weight-bold">Scheduling Tips:</span>{" "}
                  {instructions}
                </span>
              </span>
            </li>
          ) : null}
          {appointments && appointments.length > 0 ? (
            <li className="list-group-item">
              {appointments.map((appointment, index) => (
                <div key={index}>
                  <span className="badge badge-light mr-2 font-weight-normal">
                    {appointment.num} Appointments
                  </span>
                  {moment.utc(appointment.time).format("dddd, MMMM Do")}
                  {/* {appointment.types
                      ? ": " + appointment.types.join(" & ")
                      : null} */}
                </div>
              ))}
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
