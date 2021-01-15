import './App.css';
import React, { useState } from "react";
import ReactMapGL from "react-map-gl";

function App() {
  const [viewPort, setViewPort] = useState({
    latitude: 40.441694,
    longitude: -79.990086,
    width: "100vw",
    height: "100vh",
    zoom: 10,
  })
  return (
    <div>
      <ReactMapGL {...viewPort}></ReactMapGL>
    </div>
  );
}

export default App;
