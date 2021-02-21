import { Typeahead } from "react-bootstrap-typeahead";
import counties from "../content/counties";

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
        #search-input input {
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

export default function CountySearch({ searchRef, onSearch, setTopCountyOption }) {
  const onChange = () => {
    if (searchRef.current && searchRef.current.items.length > 0) {
      const topCountyOption = searchRef.current.items[0];
      setTopCountyOption(topCountyOption);
    }
  }

  return (
    <Typeahead
      id="county-filter-selection"
      className="flex-grow-1"
      ref={searchRef}
      placeholder="Search for your county..."
      options={counties}
      onChange={(selected) => onSearch(selected)}
      renderInput={(props) => <CountySearchInput {...props} />}
      onInputChange={onChange}
      onFocus={onChange}
      clearButton
      highlightOnlyResult
    />
  );
}
