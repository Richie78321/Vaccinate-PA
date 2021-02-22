import PropTypes from "prop-types";
import LocationGroup from "./LocationGroup";

function LocationGroupCategory({ locationGroupCategory }) {
  return locationGroupCategory.locationGroups.some(
    (locationGroup) => locationGroup.locations.length > 0
  ) ? (
    <div className="mb-4">
      <h3 className="mb-0 font-weight-normal">
        <u>{locationGroupCategory.categoryTitle}:</u>
      </h3>
      {locationGroupCategory.locationGroups.map((locationGroup) => (
        <LocationGroup
          key={locationGroup.message}
          locationGroup={locationGroup}
        />
      ))}
    </div>
  ) : null;
}

export default function LocationGroupCategories({ locationGroupCategories }) {
  const hasLocations = locationGroupCategories.some((locationGroupCategory) =>
    locationGroupCategory.locationGroups.some(
      (locationGroup) => locationGroup.locations
    )
  );

  return (
    <div className="d-flex flex-column">
      {!hasLocations ? (
        <>
          <h2 className="text-center mt-5">
            We currently have no locations for {county} on record.
          </h2>
          <h2 className="text-center">
            You can view all counties <Link href="/">here</Link>.
          </h2>
        </>
      ) : null}
      {locationGroupCategories.map((locationGroupCategory) => (
        <LocationGroupCategory
          key={locationGroupCategory.categoryTitle}
          locationGroupCategory={locationGroupCategory}
        />
      ))}
    </div>
  );
}

LocationGroupCategories.propTypes = {
  locationGroupCategories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryTitle: PropTypes.string.isRequired,
      locationGroups: PropTypes.arrayOf(LocationGroup.propTypes.locationGroup)
        .isRequired,
    })
  ).isRequired,
};
