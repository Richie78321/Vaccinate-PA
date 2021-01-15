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
            <div className="">
                <h2
                    className="font-bold text-lg"
                >
                    {props.selectedPark.properties.name}
                </h2>
                <p className="">{props.selectedPark.properties.address.street}</p>
            </div>
        </Popup>
    )
}
