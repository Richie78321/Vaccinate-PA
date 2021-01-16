import React from 'react'
import { InfoWindow } from "@react-google-maps/api";

export default function HospitalPopup(props) {
    return (
        <InfoWindow
            onCloseClick={() => {
                props.setSelectedHospital(null);
            }}    
            position={{ 
                lat: props.selectedHospital.geometry.coordinates[0],
                lng: props.selectedHospital.geometry.coordinates[1]
            }}
        >
            <div>
                <div className="container flex justify-between">
                    <h2
                        className="font-bold text-lg mr-5 ml-5"
                    >
                        {props.selectedHospital.properties.name}
                    </h2>
                    <p className="ml-5 mr-5 mt-0.5 text-sm text-gray-500">{props.selectedHospital.properties.address.street}</p>
                </div>

                <div className="container flex justify_between">
                    { props.selectedHospital.properties.has_doses ? 
                        <span className="text-green-500 font-bold">Has doses</span>
                        : <span className="text-red-500 font-bold">No doses</span>
                    }
                </div>
            </div>
        </InfoWindow>
    )
}
