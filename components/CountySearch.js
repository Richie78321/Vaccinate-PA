import { useCallback } from "react";
import { Typeahead, Hint } from "react-bootstrap-typeahead";
import counties from "../content/counties";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

function CountySearchInput({
  inputRef,
  referenceElementRef,
  className,
  ...inputProps
}) {
  const shouldSelect = useCallback((shouldSelect, e) => {
    return e.key === "Enter" || shouldSelect;
  }, []);

  return (
    <div id="search-input">
      <Hint shouldSelect={shouldSelect}>
        <input
          className={"border py-2 pr-3 rounded-pill" + className}
          {...inputProps}
          ref={(input) => {
            inputRef(input);
            referenceElementRef(input);
          }}
        />
      </Hint>
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

function onSelect(selected, router) {
  if (selected && selected.length > 0) {
    router.push(`counties/${selected[0].replace(" ", "_")}`);
  }
}

export default function CountySearch({ searchRef }) {
  const router = useRouter();

  const onClickFindVaccine = useCallback(() => {
    if (searchRef.current.getInput().value.length > 0) {
      if (searchRef.current.items && searchRef.current.items.length > 0) {
        // Treat closest match as selected item
        onSelect(searchRef.current.items, router);
      }
    } else {
      searchRef.current.focus();
    }
  }, [searchRef, router]);

  const onTypeaheadSelect = useCallback(
    (selected) => {
      onSelect(selected, router);
    },
    [router]
  );

  return (
    <div className="d-flex flex-row">
      <div className="flex-grow-1">
        <Typeahead
          id="county-filter-selection"
          ref={searchRef}
          placeholder="Search for your county..."
          options={counties}
          onChange={onTypeaheadSelect}
          renderInput={(props) => <CountySearchInput {...props} />}
          clearButton
          highlightOnlyResult
        />
      </div>
      <div>
        <Button
          variant="warning"
          className="rounded-pill h-100 ml-2 px-4"
          onClick={onClickFindVaccine}
        >
          Find <span className="d-none d-sm-inline">Vaccine</span>
        </Button>
      </div>
    </div>
  );
}
