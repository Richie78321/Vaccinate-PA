import "./App.css";
import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import * as hospitalData from "./data/hospitals.json";

function App() {
  const [viewPort, setViewPort] = useState({
    latitude: 40.441694,
    longitude: -79.990086,
    width: "100vw",
    height: "100vh",
    zoom: 10,
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
    <div>
      <ReactMapGL
        {...viewPort}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/zhengmingw/ckjxtj6rc21zx17rw0j3om2hg"
        onViewportChange={(viewport) => {
          setViewPort(viewport);
        }}
      >
        {hospitalData.features.map((hospital) => (
          <Marker
            key={hospital.properties.phone_number}
            latitude={hospital.geometry.coordinates[0]}
            longitude={hospital.geometry.coordinates[1]}
          >
            <button onClick={(e) => {
              e.preventDefault();
              setSelectedPark(hospital);
            }}>
              <img src="./marker.png" alt="Hospital Icon"/>
            </button> 
          </Marker>
        ))}

        { selectedPark && (
          <Popup 
            latitude={selectedPark.geometry.coordinates[0]}
            longitude={selectedPark.geometry.coordinates[1]}
            onClose={() => {
              setSelectedPark(null)
            }}
          >
              <div className="">
                <h2>{selectedPark.properties.name}</h2>
                <p className="">{selectedPark.properties.address}</p>
              </div>
            </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
