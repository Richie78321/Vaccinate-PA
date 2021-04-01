export interface AvailabilityStatus {
  value: number;
  string: string;
  display?: string;
  isAvailable: boolean;
}

export interface CountyLinks {
  "County Website"?: string;
  "County COVID Information"?: string;
  "County COVID Preregistration"?: string;
}

export interface RawLocation {
  id: string;
  fields: {
    Name: string;
    Website?: string;
    County: string;
    "Latest report"?: string;
    "Vaccines available?"?: string[];
    "Latest report notes"?: string[];
    "Number of reports": number;
    Address: string;
    "Location type"?: string;
    Latitude?: number;
    Longitude?: number;
  };
}

export interface ZipCode {
  id: string;
  fields: {
    ZIP: number;
    Latitude: number;
    Longitude: number;
  };
}

export interface Location extends RawLocation {
  isActiveSupersite: boolean;
  availabilityStatus: AvailabilityStatus;
  distanceMiles?: number;
}

export interface OrganizedLocations {
  allLocations: Location[];
  allRecentLocations: Location[];
  allOutdatedLocations: Location[];
  recentLocations: {
    availableWaitlist: Location[];
    availableAppointment: Location[];
    availableWalkIn: Location[];
  };
  outdatedLocations: {
    availableWaitlist: Location[];
    availableAppointment: Location[];
    availableWalkIn: Location[];
  };
  availabilityVaries: Location[];
  noAvailability: Location[];
  noConfirmation: Location[];
}
