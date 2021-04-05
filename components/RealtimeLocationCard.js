import moment from "moment";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";

// Smelly af but works for now. <- lol
const brandInstructions = {
    walgreens: () => (
        <>
            <span className="text-nowrap">
                <a href="" target="_blank" rel="noreferrer">
                    View More <FaExternalLinkAlt size=".75em" />
                </a>
            </span>
        </>
    ),
    rite_aid: () => (
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
        </>
    ),
    weis: () => (
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
        </>
    ),
};

const PROVIDER_TO_METADATA = {
    albertsons: {
        name: "ACME",
        image:
            "https://upload.wikimedia.org/wikipedia/commons/8/80/Logo_acme.svg",
    },
    walgreens: {
        name: "Walgreens",
        image:
            "https://upload.wikimedia.org/wikipedia/commons/6/65/Walgreens_Logo.svg",
        instructions:
            "https://drive.google.com/file/d/1aZmz5lYQ2eh2PeALw1FrqPSJjOYJStK-/view?usp=sharing",
    },
    cvs: {
        name: "CVS",
        image:
            "https://upload.wikimedia.org/wikipedia/commons/1/1b/CVS_Pharmacy_Alt_Logo.svg",
    },
    rite_aid: {
        name: "Rite Aid",
        image:
            "https://upload.wikimedia.org/wikipedia/commons/6/6b/Rite_Aid.svg",
        instructions:
            "https://drive.google.com/file/d/1h2PRp_kNFGGuieq9KIAwIkGYB1ohJYP5/view?usp=sharing",
    },
    sams_club: {
        name: "Sams Club",
        image:
            "https://upload.wikimedia.org/wikipedia/commons/e/e7/Sams_Club.svg",
    },
    walmart: {
        name: "Walmart",
        image:
            "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg",
    },
    wegmans: {
        name: "Wegmans",
        image:
            "https://upload.wikimedia.org/wikipedia/commons/d/de/WegmansLogo.svg",
    },
    weis: {
        name: "Weis",
        image:
            "https://upload.wikimedia.org/wikipedia/commons/f/f3/Weis_Markets_logo.svg",
        instructions:
            "https://drive.google.com/file/d/1L4gCp3cke2DmIiU-014GrGyhopre2L_M/view?usp=sharing",
    },
};

function ZipCodeInstructions({ location }) {
    if (!location.properties.postal_code) {
        return null;
    }

    return (
        <span>
            Enter the zip code <b>{location.properties.postal_code}</b> when
            searching for appointments. Look for the location with a matching
            address.
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

const AppointmentDetail = ({ location }) => {
    const appointments = location.properties?.appointments;
    const address = `${location.properties.address}, ${location.properties.city} ${location.properties.postal_code}`;
    const distanceMiles = location.distanceMiles;
    const websiteUrl = location?.properties?.url;
    return (
        <li className="list-group-item">
            {address ? (
                <>
                    <div>
                        <small>
                            <u>{address}</u>{" "}
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                    address
                                )}`}
                            >
                                <FaExternalLinkAlt size=".85em" />
                            </a>
                        </small>
                    </div>
                    {location.properties.postal_code && websiteUrl && (
                        <small>
                            <a href={websiteUrl}>Click here</a> to schedule an
                            appointmment and enter the zip code{" "}
                            <b>{location.properties.postal_code}</b> when
                            searching.{" "}
                        </small>
                    )}
                    <div>
                        <small></small>
                    </div>
                </>
            ) : null}
            {appointments && appointments.length > 0 ? (
                <>
                    {appointments.map((appointment, index) => (
                        <div key={index}>
                            <small>
                                <span className="badge badge-light mr-2 font-weight-normal">
                                    {appointment.num} Appointments
                                </span>
                                {moment
                                    .utc(appointment.time)
                                    .format("dddd, MMMM Do")}
                                {/* {appointment.types
                      ? ": " + appointment.types.join(" & ")
                      : null} */}
                            </small>
                        </div>
                    ))}
                </>
            ) : null}
            <p className="my-0 text-truncate">
                {distanceMiles ? (
                    <>
                        <small>~{Math.round(distanceMiles)} miles away</small>
                        <span className="text-muted">{" | "}</span>
                    </>
                ) : null}
            </p>
        </li>
    );
};

export default function RealtimeLocationCard({ providerId, locations }) {
    const firstLocation = locations[0];
    const website = firstLocation?.properties?.url;
    const latestReportTimeText = firstLocation.properties
        .appointments_last_fetched
        ? moment(firstLocation.properties.appointments_last_fetched).fromNow()
        : null;
    const name = firstLocation.properties.provider_brand_name
        ? firstLocation.properties.provider_brand_name
        : firstLocation.properties.name;

    // if (appointments) {
    //   appointments.forEach((appointment) => {
    //     formatAppointment(appointment);
    //   });
    // }

    let instructionsLink = null;
    if (brandInstructions[providerId]) {
        instructionsLink = PROVIDER_TO_METADATA[providerId].instructions;
    }

    const logoUrl = PROVIDER_TO_METADATA[providerId].image;

    return (
        <>
            <div className="location-card card">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-auto title-section">
                                <div>
                                    <h5 className="mb-0 card-title text-truncate">
                                        {name}
                                    </h5>
                                    {website ? (
                                        <a
                                            href={website}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <small>
                                                Schedule Appointment{" "}
                                                <FaExternalLinkAlt size=".85em" />
                                            </small>
                                        </a>
                                    ) : null}
                                </div>
                                <div className="realtime-right-card flex">
                                    {latestReportTimeText ? (
                                        <span className="ml-3 mb-2 badge badge-pill badge-light font-weight-normal text-wrap">
                                            Updated {latestReportTimeText}
                                        </span>
                                    ) : null}
                                    <img
                                        className="provider-logo"
                                        src={logoUrl}
                                    ></img>
                                </div>
                            </div>
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
                    {instructionsLink ? (
                        <li className="list-group-item">
                            <span className="text-black">
                                <BsInfoCircle size="1.25em" className="mr-1" />{" "}
                                <span className="align-middle">
                                    <span className="font-weight-bold">
                                        Scheduling Tips:
                                    </span>{" "}
                                    Enter the zip code of the location when
                                    searching for appointments. Look for the
                                    location with a matching address.{" "}
                                    <a
                                        href={instructionsLink}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View More{" "}
                                        <FaExternalLinkAlt size=".75em" />
                                    </a>
                                </span>
                            </span>
                        </li>
                    ) : null}

                    {locations.map((location) => (
                        <AppointmentDetail location={location} />
                    ))}
                </ul>
            </div>
            <style jsx>{`
                .title-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }
                .realtime-right-card {
                    display: flex;
                    flex-direction: column;
                    justify-content: right;
                    align-items: flex-end;
                }
                .location-card {
                    box-shadow: 1px 1px 20px 2px rgb(0 0 0 / 10%);
                }
                .provider-logo {
                    height: 40px;
                    max-width: 170px;
                }
            `}</style>
        </>
    );
}
