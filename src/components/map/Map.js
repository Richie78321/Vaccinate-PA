import React, {useState,useEffect, useCallback, useRef} from 'react'
import { 
    GoogleMap, 
    useLoadScript 
} from "@react-google-maps/api";
import * as hospitalData from "../../data/hospitals.json";
import mapStyles from "../../mapStyles";

import HospitalMarker from "./HospitalMarker";
import HospitalPopup from "./HospitalPopup";

const libraries = ["places"]

const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
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
        mapRef.current.setZoom(14);
    }, [])

    function Locate ({panTo}) {
        return (
        <button 
            className="bg-transparent absolute top-1 left-1 z-10"
            onClick={() => {
                navigator.geolocation.getCurrentPosition((position)=>{
                    panTo({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },()=>null);
            }}
        >
            <img src="./compass.svg" alt="Compass Icon" className="w-24"/>
        </button>
        )
    }

    if (loadError) return "Error loading map";
    if (!isLoaded) return "Currently loading map";

    return (
        <>
            <Locate panTo={panTo} />
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={14}
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
        </>
    );
}
