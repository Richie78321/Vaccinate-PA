import { Typeahead } from "react-bootstrap-typeahead";
import counties from "../content/counties";
import { useRouter } from "next/router";

export default function CountySearch({ searchRef }) {
  const router = useRouter();

  const onButtonClick = () => {
    // TODO: on clicking this button figure out closest county and go there
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });

    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  return (
    <div className="flex mt-3">
      <div className="flex-1 county-search">
        <Typeahead
          id="county-filter-selection"
          ref={searchRef}
          placeholder="Type your county..."
          options={counties}
          onChange={(selected) => {
            if (selected && selected.length > 0) {
              router.push(`counties/${selected[0].replace(" ", "_")}`);
            }
          }}
          clearButton
        />
      </div>
      <button onClick={onButtonClick} className="ml-3 btn btn-info">
        Find vaccine
      </button>
    </div>
  );
}
