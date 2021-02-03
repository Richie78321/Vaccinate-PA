import { useCallback } from "react";
import Link from "next/link";
import CountyLink from "./CountyLink";

const FindMyCounty = ({ searchRef }) => {
  const onClick = useCallback(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchRef]);

  return (
    <>
      <a
        onClick={onClick}
        className="find-county-button text-white d-block rounded py-2 px-3 mb-3 text-decoration-none user-select-none"
      >
        Find my county
      </a>
      <style jsx>{`
        .find-county-button {
          background #1F2937;
          box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 20px 2px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default function CountySuggestion({ searchRef }) {
  return (
    <div className="rounded county-suggestions px-3 px-sm-5 py-4">
      <div className="row">
        <div className="col-md-6">
          <h4 className="mb-3">More information about vaccine availability</h4>
          <p>
            As of January 19th, 2021, the State of Pennsylvania has approved
            giving the COVID-19 vaccine to people age 65 and older.
            Pennsylvania's statewide COVID-19 vaccination program has been
            evolving rapidly. You can find more information and links to
            government websites <Link href="/additional-resources">here</Link>.
            We are a community-led website and do not represent the government
            or any healthcare provider.
            <p className="mt-3">
              <Link href="/about-us">About VaccinatePA →</Link>
            </p>
          </p>
        </div>
        <div className="order-md-first col-12 col-md-6">
          <h4>Vaccine locations by county</h4>
          <div className="row mt-4">
            <div className="col-lg-6">
              <CountyLink county="Allegheny County" />
              <CountyLink county="Montgomery County" />
              <CountyLink county="Bucks County" />
              <CountyLink county="Delaware County" />
            </div>
            <div className="col-lg-6">
              <div className="d-none d-md-block">
                <CountyLink county="Lancaster County" />
                <CountyLink county="Chester County" />
                <CountyLink county="York County" />
              </div>
              <FindMyCounty searchRef={searchRef} />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .county-suggestions {
          background-color: #fcd34d;
        }
      `}</style>
    </div>
  );
}
