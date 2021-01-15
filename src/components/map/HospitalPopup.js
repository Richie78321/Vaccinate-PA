import React from 'react'
import { Popup } from "react-map-gl";

export default function HospitalPopup(props) {
    return (
        <Popup 
            latitude={props.selectedPark.geometry.coordinates[0]}
            longitude={props.selectedPark.geometry.coordinates[1]}
            onClose={() => {
            props.setSelectedPark(null)
            }}
        >
            <div className="container flex justify-between">
                <h2
                    className="font-bold text-lg mr-2"
                >
                    {props.selectedPark.properties.name}
                </h2>
                <p className="ml-2 mt-0.5 text-sm text-gray-500">{props.selectedPark.properties.address.street}</p>
            </div>
            <div className="container flex justify_between">
                { props.selectedPark.properties.has_doses ? 
                    <span className="text-green-500 font-bold">Has doses</span>
                    : <span className="text-red-500 font-bold">No doses</span>
                }
            </div>
        </Popup>
    )
}
