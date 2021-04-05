import {
  OrganizedLocations,
  Location,
  RawLocation,
  CountyLinks,
  AvailabilityStatus,
  ZipCode,
} from "./DataTypes";

const OUTDATED_DAYS_THRESHOLD = 3;

export const AVAILABILITY_STATUS: { [key: string]: AvailabilityStatus } = {
  UNKNOWN: {
    value: 0,
    string: "No confirmation / unknown",
    isAvailable: false,
  },
  NO: { value: 1, string: "No", isAvailable: false },
  VARIES: { value: 2, string: "Availability varies", isAvailable: false },
  APPOINTMENT: {
    value: 3,
    string: "Yes, with appointment only",
    display: "With Appointment Only",
    isAvailable: true,
  },
  WALK_IN: {
    value: 4,
    string: "Yes, walk-ins accepted",
    display: "Walk-ins Accepted",
    isAvailable: true,
  },
  WAITLIST: {
    value: 5,
    string: "Waitlist Only",
    display: "Waitlist Only",
    isAvailable: true,
  },
};

/**
 * Organize locations based on time and availability status for easier frontend
 * consumption.
 * @param locations The list of locations.
 * @returns Returns an organized list of locations.
 */
export function organizeLocations(locations: Location[]): OrganizedLocations {
  const outdatedThreshold: Date = new Date();
  outdatedThreshold.setDate(
    outdatedThreshold.getDate() - OUTDATED_DAYS_THRESHOLD
  );

  const allRecentLocations: Location[] = locations.filter(
    (location) =>
      location.fields["Latest report"] &&
      (location.fields["Location type"] === "Supersite" ||
        Date.parse(location.fields["Latest report"]) >
          outdatedThreshold.getTime())
  );
  const allOutdatedLocations: Location[] = locations.filter(
    (location) =>
      location.fields["Latest report"] &&
      location.fields["Location type"] !== "Supersite" &&
      Date.parse(location.fields["Latest report"]) <=
        outdatedThreshold.getTime()
  );

  const separateAvailability = (locations) => ({
    availableWaitlist: locations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.WAITLIST.value
    ),
    availableAppointment: locations.filter(
      (location) =>
        location.availabilityStatus.value ===
        AVAILABILITY_STATUS.APPOINTMENT.value
    ),
    availableWalkIn: locations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.WALK_IN.value
    ),
  });

  return {
    allLocations: locations,
    allRecentLocations: allRecentLocations,
    allOutdatedLocations: allOutdatedLocations,
    recentLocations: separateAvailability(allRecentLocations),
    outdatedLocations: separateAvailability(allOutdatedLocations),
    availabilityVaries: locations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.VARIES.value
    ),
    noAvailability: locations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.NO.value
    ),
    noConfirmation: locations.filter(
      (location) =>
        location.availabilityStatus.value === AVAILABILITY_STATUS.UNKNOWN.value
    ),
  };
}
