import React from "react";
import { InfoWindow } from "@react-google-maps/api";

export default function HospitalPopup(props) {
  return (
    <InfoWindow
      onCloseClick={() => {
        props.setSelectedHospital(null);
      }}
      position={{
        lat: props.selectedHospital.geometry.coordinates[0],
        lng: props.selectedHospital.geometry.coordinates[1],
      }}
    >
      <div className="min-w-full">
        <div className="container flex justify-between">
          <h2 className="font-bold text-3xl ">
            {props.selectedHospital.properties.name}
          </h2>
          <div className="ml-12">
            <p className="mt-1.5 text-sm text-gray-500">
              {props.selectedHospital.properties.address.street}
            </p>
            <p className="text-sm text-right text-gray-500">
              {props.selectedHospital.properties.phone}
            </p>
          </div>
        </div>

        <div className="container flex justify-between">
          <div className="">
            {props.selectedHospital.properties.has_doses ? (
              <span className="text-green-500 text-lg font-bold">
                Has doses
              </span>
            ) : (
              <span className="text-red-500 text-lg font-bold">No doses</span>
            )}
          </div>
          <div>
            <span className="text-bold">
              {" "}
              Last Updated: {props.selectedHospital.properties.last_update}
            </span>
          </div>
        </div>
      </div>
    </InfoWindow>
  );
}
