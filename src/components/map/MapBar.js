import React from "react";

import Locate from "./Locate";
import SearchBar from "./SearchBar";

export default function MapBar(props) {
  return (
    <div className="px-3 sm:px-0 py-3 grid grid-cols-3 sm:grid-cols-4">
      <div className="my-2 sm:my-auto place-self-center sm:place-self-left col-span-3 sm:col-span-1"><Locate panTo={props.panTo} /></div>
      <div className="my-2 sm:my-auto place-self-stretch col-span-3"><SearchBar panTo={props.panTo} /></div>
    </div>
  );
}
