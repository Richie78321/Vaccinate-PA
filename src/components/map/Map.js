import React, {useState,useEffect, useCallback, useRef} from 'react'
import { 
    GoogleMap, 
    useLoadScript 
} from "@react-google-maps/api";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";


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
        mapRef.current.setZoom(16);
    }, [])

    if (loadError) return "Error loading map";
    if (!isLoaded) return "Currently loading map";

    return (
        <>
            <Search panTo={panTo}/>

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

function Search({ panTo }) {
    const {
        ready, 
        value, 
        suggestions: {status, data}, 
        setValue, 
        clearSuggestions
    } = usePlacesAutocomplete({
        requestOptions: {
            location: {
                lat: () => 40.4416941,
                lng: () => -79.9900861
            },
            radius: 100 * 1000
        }
    });
    
    const handleInput = (e) => {
        setValue(e.target.value);
    }

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng} = await getLatLng(results[0]);
            panTo({lat, lng});
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    return (
    <div className="absolute top-1 left-1/2 transform translate-x-0 width-full max-w-screen-sm z-10 ">        
        <Combobox onSelect = { handleSelect }>
            <ComboboxInput 
                value={value} 
                onChange={handleInput} 
                disabled ={!ready}
                placeholder="Enter an address"
                className="p-2 text-4xl width-full"
            />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" && data.map(({id, description}) => ( 
                        <ComboboxOption 
                            key={id + description} value={description}
                            className="bg-white"                                
                            />
                        ) )}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    </div>
    )
}

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