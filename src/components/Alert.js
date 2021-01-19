import React from "react";
import Popup from "reactjs-popup";

export default function Alert() {
  return (
    <Popup trigger={<div></div>} open={true} modal>
      <div className="bg-red-600 p-5 w-60 h-60 md:w-96 md:h-96 md:text-3xl md:p-15 z-10 text-white font-bold flex justify-center items-center text-center">
        ⚠ <br /> NOTE: THIS IS A WIP. ALL DATA IS FAKE AND FOR TESTING PURPOSES.
        <br />
        <br /> Click outside box to close.
        <br /> ⚠
      </div>
    </Popup>
  );
}
