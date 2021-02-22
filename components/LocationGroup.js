import AirTableCard from "./AirTableCard";
import PropTypes from 'prop-types';

export default function LocationGroup({ locationGroup }) {
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

LocationGroup.propTypes = {
  locationGroup: PropTypes.shape({
    messageIcon: PropTypes.element.isRequired,
    messageColor: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    locations: PropTypes.array.isRequired,
  }).isRequired,
};
