import AirTableCard from "./AirTableCard";
import { Location, OrganizedLocations } from "../utils/DataTypes";
import {
  FaWalking,
  FaCalendarAlt,
  FaTimesCircle,
  FaQuestionCircle,
  FaClipboardList,
} from "react-icons/fa";

export interface LocationGroupType {
  messageIcon: any,
  message: string,
  messageColor: string,
  locations: Location[],
}

interface LocationGroupsProps {
  locationGroups: LocationGroupType[],
  header: string,
}

interface StandardLocationGroupsProps {
  locations: OrganizedLocations,
}

export function StandardLocationGroups(props: StandardLocationGroupsProps) {
  const { locations } = props;

  const recentLocationGroups: LocationGroupType[] = [
    {
      messageIcon: <FaWalking />,
      message: "Vaccines reported available walk-in",
      messageColor: "text-success",
      locations: locations.recentLocations.availableWalkIn,
    },
    {
      messageIcon: <FaCalendarAlt />,
      message: "Vaccines reported available with appointment",
      messageColor: "text-success",
      locations: locations.recentLocations.availableAppointment,
    },
    {
      messageIcon: <FaClipboardList />,
      message: "Vaccine waitlist signup reported available",
      messageColor: "text-info",
      locations: locations.recentLocations.availableWaitlist,
    },
  ];

  const outdatedLocationGroups: LocationGroupType[] = [
    {
      messageIcon: <FaWalking />,
      message: "Vaccines reported available walk-in",
      messageColor: "text-success",
      locations: locations.outdatedLocations.availableWalkIn,
    },
    {
      messageIcon: <FaCalendarAlt />,
      message: "Vaccines reported available with appointment",
      messageColor: "text-success",
      locations: locations.outdatedLocations.availableAppointment,
    },
    {
      messageIcon: <FaClipboardList />,
      message: "Vaccine waitlist signup reported available",
      messageColor: "text-info",
      locations: locations.outdatedLocations.availableWaitlist,
    },
    {
      messageIcon: <FaQuestionCircle />,
      message: "Availability varies",
      messageColor: "text-dark",
      locations: locations.availabilityVaries,
    },
    {
      messageIcon: <FaTimesCircle />,
      message: "Vaccines reported unavailable",
      messageColor: "text-danger",
      locations: locations.noAvailability,
    },
    {
      messageIcon: <FaQuestionCircle />,
      message: "No confirmation / uncontacted",
      messageColor: "text-dark",
      locations: locations.noConfirmation,
    },
  ];

  return (
    <>
      <LocationGroups locationGroups={recentLocationGroups} header="Recent availability" />
      <LocationGroups locationGroups={outdatedLocationGroups} header="All reports" />
    </>
  )
}

export default function LocationGroups(props: LocationGroupsProps) {
  const {
    locationGroups,
    header
  } = props;

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