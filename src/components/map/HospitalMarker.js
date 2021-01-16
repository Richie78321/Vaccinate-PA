import React from 'react'
import { Marker } from "@react-google-maps/api";

export default function HospitalMarker(props) {
    return (
        <Marker 
            position={{
                lat: props.hospital.geometry.coordinates[0],
                lng: props.hospital.geometry.coordinates[1]
            }}
            onClick={()=>{
                console.log(props.hospital)
                props.setSelectedHospital(props.hospital);
            }}
            icon={{
                url:'./blue_marker.png'
            }}
        />
    )
}
