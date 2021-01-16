import React from 'react'

import Locate from "./Locate";
import SearchBar from "./SearchBar";

export default function MapBar(props) {
    return (
        <div className="flex container justify-between flex-row-reverse">
            <SearchBar panTo={props.panTo}/>
            <Locate panTo={props.panTo} />
        </div>
    )
}
