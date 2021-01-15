import React,{useState, useEffect} from 'react'
import ReactMapGL, { Popup } from "react-map-gl";
import * as hospitalData from "../../data/hospitals.json";
import Hospitalmark from "./Hospitalmark";
import HospitalPopup from "./HospitalPopup"

export default function Map() {
    const [viewPort, setViewPort] = useState({
        latitude: 40.441694,
        longitude: -79.990086,
        width: "100vw",
        height: "93.5vh",
        zoom: 12.5,
    });

    const [selectedPark, setSelectedPark] = useState(null);

    useEffect(()=>{
        const listener = e => {
        if (e.key === "Escape") {
            setSelectedPark(null);
        }
        };
        window.addEventListener("keydown", listener);

        return () => {
        window.removeEventListener("keydown", listener);
        }
    }, []);

    return (
        <>
            <ReactMapGL
                {...viewPort}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                mapStyle="mapbox://styles/zhengmingw/ckjxtj6rc21zx17rw0j3om2hg?optimize=true"
                onViewportChange={(viewport) => {
                setViewPort(viewport);
                }}
            >
                {hospitalData.features.map((hospital) => (
                    <Hospitalmark setSelectedPark={setSelectedPark} hospital={hospital}/>
                ))}

                { selectedPark && <HospitalPopup selectedPark={selectedPark} setSelectedPark={setSelectedPark} />}
            </ReactMapGL>
        </>
    )
}
