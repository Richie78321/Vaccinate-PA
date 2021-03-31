import AirTableCard from "./AirTableCard";

export default function LocationGroups({ locationGroups, header }) {
  if (!locationGroups.some((locationGroup) => locationGroup.locations.length > 0)) {
    return null;
  }

  return (
    <>
      <h3 className="mt-4 mb-0 font-weight-normal">
        <u>{header}:</u>
      </h3>
      {locationGroups.map((locationGroup) => (
        <LocationGroup
          key={locationGroup.message}
          locationGroup={locationGroup}
        />
      ))}
    </>
  )
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