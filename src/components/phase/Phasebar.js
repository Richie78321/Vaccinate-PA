import React from "react";

export default function Phasebar(props) {
  const phases = ["1A", "1B", "1C", "2"];
  return (
    <>
      <div className="flex border border-blue-900 mb-2 mt-6">
        {phases.map((phase, i) =>
          props.num >= i ? (
            <div
              key={phase}
              className="md:w-40 md:h-40 md:text-lg lg:w-60 lg:h-60 p-5 bg-blue-300 flex justify-center items-center font-bold text-xs lg:text-2xl 
                                text-blue-900 sm:transition sm:duration-500 sm:ease-in-out hover:bg-blue-900 hover:text-white"
            >
              Phase {phase}
            </div>
          ) : (
            <div
              key={phase}
              className="md:w-40 md:h-40 md:text-lg lg:w-60 lg:h-60 p-5 bg-white flex justify-center items-center font-bold text-xs lg:text-2xl 
                                text-gray-400 sm:transition sm:duration-500 sm:ease-in-out hover:bg-gray-500 hover:text-gray-200"
            >
              Phase {phase}
            </div>
          )
        )}
      </div>
      <div className="p-2 flex flex-col items-center">
        <h2 className="text-blue-900 text-lg font-semibold sm:text-3xl">
          Who Qualifies?
        </h2>
        <h2 className="text-blue-900 text-xs italic sm:text-base">
          According to PA DOH
        </h2>
        <ul className="list-disc sm:text-xl mt-2 sm:mt-4">
          <li>Long Term Care Residents</li>
          <li>Health Care Personnel</li>
        </ul>
      </div>
    </>
  );
}
