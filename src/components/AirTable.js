import React, { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import counties from "../content/counties.json";

function checkHashURLForCountyFilter() {
  let countyFilter = null;
  if (window.location.hash.length > 1) {
    const countyFromURL = window.location.hash.substring(1).replace("_", " ");
    if (counties.includes(countyFromURL)) {
      countyFilter = countyFromURL;
    }
  }

  return countyFilter;
}

export default function AirTable() {
  const [countyFilter, setCountyFilter] = useState(
    checkHashURLForCountyFilter()
  );

  let airtableURL =
    "https://airtable.com/embed/shr1fCiGy7sVnNixq?backgroundColor=grayLight&viewControls=on";
  if (countyFilter) {
    airtableURL += `&filter_County=${countyFilter}`;
  }

  return (
    <>
      <Typeahead
        id="county-filter-selection"
        placeholder="Search by county..."
        defaultInputValue={countyFilter ? countyFilter : ""}
        options={counties}
        onChange={(selected) => {
          if (selected && selected.length > 0) {
            window.location.hash = selected[0].replace(" ", "_");
            setCountyFilter(selected[0]);
          }
        }}
      />
      <iframe
        title="All County Airtable Embed"
        src={airtableURL}
        frameBorder="0"
        width="100%"
        height="100%"
        style={{ height: "85vh" }}
        className="airtable-embed"
      />
    </>
  );
}
