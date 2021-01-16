import React from 'react'

export default function Locate(props) {
    return (
        <button 
            className="bg-gray-300 py-1 px-6 my-2 text-center hover:bg-gray-800 hover:text-white active:bg-gray-600 active:text-white"
            onClick={() => {
                navigator.geolocation.getCurrentPosition((position)=>{
                    props.panTo({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },()=>null);
            }}
        >
            Locate Me!
        </button>
    )
}
