import moment from "moment";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";

function toTitleCase(str) {
  return str.replace(/(^|\s)\S/g, function (t) {
    return t.toUpperCase();
  });
}

function formatAppointment(appointment) {
  if (appointment.types) {
    appointment.types = appointment.types.map((type) =>
      toTitleCase(type.replaceAll("_", " "))
    );
  }
}

export default function RealtimeLocationCard({ location }) {
  const website = location?.brand_info?.appointmentLink;
  const address = `${location.address}, ${location.city} ${location.postal_code}`;
  const latestReportTimeText = location.appointments_last_fetched
    ? moment(location.appointments_last_fetched).fromNow()
    : null;
  const name = location.brand_info.name
    ? location.brand_info.name
    : location.name;

  const appointments = location.appointments;
  if (appointments) {
    appointments.forEach((appointment) => {
      formatAppointment(appointment);
    });
  }

  return (
    <>
      <div className="location-card card">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="row">
              <div className="col-sm-8 col-md-10">
                <h5 className="mb-0 card-title text-truncate">{name}</h5>
                <p className="my-0 text-truncate">
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
            <span className="text-success font-weight-bold">
              <FaCalendarAlt size="1.25em" className="mr-1" />{" "}
              <span className="align-middle">
                Vaccines available with appointment
              </span>
            </span>
          </li>
          {appointments && appointments.length > 0
            ? appointments.map((appointment, index) => (
                <li key={index} className="list-group-item">
                  <span className="badge badge-secondary mr-2">
                    {appointment.num}
                  </span>
                  {moment(appointment.time).format("dddd, MMMM Do")}
                  {appointment.types
                    ? ": " + appointment.types.join(" & ")
                    : null}
                </li>
              ))
            : null}
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
