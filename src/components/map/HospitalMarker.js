import React from 'react'
import { Marker } from "@react-google-maps/api";

export default function HospitalMarker(props) {
    const position = {
        lat: props.hospital.geometry.coordinates[0],
        lng: props.hospital.geometry.coordinates[1]
    }
    return (
        <Marker 
            position={position}
            onClick={()=>{
                props.panTo(position)
                props.setSelectedHospital(props.hospital);
            }}
            clusterer={props.clusterer}
            icon={{
                url: props.hospital.properties.has_doses ? './blue_marker.png' : './red_marker.png'
            }}
        />
    )
}
