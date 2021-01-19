import React from 'react'
import Phasebar from "./Phasebar"

export default function Phases(props) {
    const phaseToNum = {
        "1A": 0,
        "1B": 1,
        "1C": 2,
        "2":3
    }
    
    return (
        <div className="flex flex-col items-center mb-24">
            <h2 className="text-blue-900 text-4xl font-bold">Pennsylvania COVID-19 Vaccination Phases</h2>
            <h2 className="text-blue-900 text-2xl font-bold mt-2">Currently In: <span className="bg-blue-300">Phase {props.phase}</span></h2>
            <Phasebar num={phaseToNum[props.phase]}/>
        </div>
    )
}
