import React from 'react'
import { Marker } from "react-map-gl";

export default function Hospitalmark(props) {
    const SIDE_LEN = 32;

    return (
        <>
            <Marker
                key={props.hospital.properties.phone_number}
                latitude={props.hospital.geometry.coordinates[0]}
                longitude={props.hospital.geometry.coordinates[1]}
                offsetTop={-SIDE_LEN}  offsetLeft={-(SIDE_LEN/2)}
            >
                <button onClick={(e) => {
                e.preventDefault();
                props.setSelectedPark(props.hospital);
                }}>
                <img src="./marker.png" alt="Hospital Icon"/>
                </button> 
            </Marker>
        </>
    )
}
