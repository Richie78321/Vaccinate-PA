import React from 'react'

export default function Phasebar(props) {
    const phases = ["1A","1B","1C","2"]
    return (
        <div className="flex border border-blue-900 my-2">
            {
                phases.map((phase, i)=>(
                    (props.num <= i )
                    ?   <div key={phase} className="sm:w-60 sm:h-60 p-5 bg-blue-300 flex justify-center items-center font-bold text-2xl text-blue-900 transition duration-500 ease-in-out hover:bg-blue-900 hover:text-white">
                            Phase {phase}
                        </div>
                    :   <div key={phase} className="sm:w-60 sm:h-60 p-5 bg-white flex justify-center items-center font-bold text-2xl text-gray-600 transition duration-500 ease-in-out hover:bg-blue-900 hover:text-white">
                            Phase {phase}
                        </div>
                ))
            }
        </div>
    )
}