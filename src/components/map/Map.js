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
    width: "100%",
    height: "100%",
    position: "relative",
    overflow:"hidden",
}

const center = {
    lat: 40.441694,
    lng: -79.990086
}

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
}

export default function Map() {
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
        <div className="container h-72 md:h-96 lg:h-full">
        {/* // <div className="my-4 w-1/2 h-1/2"> */}
            {/* <MapBar panTo={panTo}/> */}
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
        {/* </div> */}
        </div>
    );
}