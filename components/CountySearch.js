import { Typeahead } from "react-bootstrap-typeahead";
import counties from "../content/counties";
import { useRouter } from "next/router";

function CountySearchInput({
  inputRef,
  referenceElementRef,
  className,
  ...inputProps
}) {
  return (
    <div id="search-input">
      <input
        className={"border py-2 pr-3 rounded-pill" + className}
        {...inputProps}
        ref={(input) => {
          inputRef(input);
          referenceElementRef(input);
        }}
      />
      <style jsx>{`
        #search-input input  {
          font-size: 115%;
          width: 100%;
          border: none;
          background-image: url(/search_icon.svg);
          background-repeat: no-repeat;
          padding-left: 38px;
          background-position: 12px 50%;
        }

        #search-input input:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}

export default function CountySearch({ searchRef }) {
  const router = useRouter();

  return (
    <Typeahead
      id="county-filter-selection"
      ref={searchRef}
      placeholder="Search for your county..."
      options={counties}
      onChange={(selected) => {
        if (selected && selected.length > 0) {
          router.push(`counties/${selected[0].replace(" ", "_")}`);
        }
      }}
      renderInput={(props) => <CountySearchInput {...props} />}
      clearButton
      highlightOnlyResult
    />
  );
}
