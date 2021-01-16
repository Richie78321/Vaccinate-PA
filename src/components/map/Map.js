import React, {useState,useEffect, useCallback, useRef} from 'react'
import { 
    GoogleMap, 
    useLoadScript 
} from "@react-google-maps/api";

import MapBar from "./MapBar"

import * as hospitalData from "../../data/hospitals.json";
import mapStyles from "../../mapStyles";

import HospitalMarker from "./HospitalMarker";
import HospitalPopup from "./HospitalPopup";

const libraries = ["places"]

const mapContainerStyle = {
    width: "50vw",
    height: "50vh",
    border: "0.15em solid black",
}

const center = {
    lat: 40.441694,
    lng: -79.990086
}

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true
}

export default function PennMap() {
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
        libraries,
    });

    const [selectedHospital, setSelectedHospital] = useState(null)

    useEffect(()=>{
            const listener = e => {
            if (e.key === "Escape") {
                setSelectedHospital(null);
            }
            };
            window.addEventListener("keydown", listener);

            return () => {
            window.removeEventListener("keydown", listener);
            }
    }, []);

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, [])

    const panTo = useCallback(({lat, lng}) => {
        mapRef.current.panTo({lat,lng});
        mapRef.current.setZoom(15);
    }, [])

    if (loadError) return "Error loading map";
    if (!isLoaded) return "Currently loading map";

    return (
        <div className="my-4">
            <MapBar panTo={panTo}/>
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={13}
                center={center}
                options={options}
                onLoad={onMapLoad}
            >
                {
                    hospitalData.features.map((hospital) => (
                        <HospitalMarker 
                            key={hospital.properties.name}
                            setSelectedHospital={setSelectedHospital} 
                            hospital={hospital}
                            panTo={panTo}
                        />
                    ))
                }

                {selectedHospital 
                    && 
                    <HospitalPopup 
                        setSelectedHospital={setSelectedHospital} 
                        selectedHospital = {selectedHospital} 
                    />
                }
            </GoogleMap>
        </div>
    );
}