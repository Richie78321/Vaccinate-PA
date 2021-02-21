import { useCallback, useState } from "react";
import { Typeahead, Hint } from "react-bootstrap-typeahead";
import counties from "../content/counties";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";

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

  const [invalidSubmit, setInvalidSubmit] = useState(false);

  const onInputChange = useCallback(() => {
    if (invalidSubmit) {
      setInvalidSubmit(false);
    }
  }, [invalidSubmit]);

  const onClickFindVaccine = useCallback(() => {
    if (searchRef.current.getInput().value.length > 0) {
      if (searchRef.current.items && searchRef.current.items.length > 0) {
        // Treat closest match as selected item
        onSelect(searchRef.current.items, router);
      } else {
        setInvalidSubmit(true);
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
          onInputChange={onInputChange}
          className={invalidSubmit ? "is-invalid" : ""}
        />
        <Form.Control.Feedback type="invalid" className="ml-2">
          Could not find that county. Please double-check your spelling.
        </Form.Control.Feedback>
      </div>
      <div id="find-vaccine-button">
        <Button
          variant="warning"
          className="rounded-pill ml-2 px-4 h-100"
          onClick={onClickFindVaccine}
        >
          Find <span className="d-none d-sm-inline">Vaccine</span>
        </Button>
      </div>
      <style jsx>{`
        #find-vaccine-button {
          height: 45px;
        }
      `}</style>
    </div>
  );
}
