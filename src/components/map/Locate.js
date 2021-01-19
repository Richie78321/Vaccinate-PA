import React from "react";

export default function Locate(props) {
  return (
    <button
      className="p-4 bg-gray-300 hover:bg-gray-800 active:bg-gray-600 hover:text-white active:text-white rounded"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            props.panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      Locate Me!
    </button>
  );
}
