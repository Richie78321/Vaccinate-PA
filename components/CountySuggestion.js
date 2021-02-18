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
    <div className="county-suggestions px-3 px-sm-5 py-4">
      <div className="container">
        <div className="mx-md-n5 row justify-content-center">
          <div className="col-12 col-md-7">
            <h4>Click your county to view vaccine locations</h4>
            <div className="row mt-4">
              <div className="col-lg-6 col-xl-4 text-truncate">
                <CountyLink county="Allegheny County" />
                <CountyLink county="Montgomery County" />
                <CountyLink county="Bucks County" />
                <CountyLink county="Delaware County" />
              </div>
              <div className="col-lg-6 d-block d-xl-none text-truncate">
                <div className="d-none d-md-block">
                  <CountyLink county="Lancaster County" />
                  <CountyLink county="Chester County" />
                  <CountyLink county="York County" />
                </div>
                <FindMyCounty searchRef={searchRef} />
              </div>
              {/* Additional column for wider displays. */}
              <div className="col-lg-6 col-xl-4 d-none d-xl-block text-truncate">
                <CountyLink county="Lancaster County" />
                <CountyLink county="Chester County" />
                <CountyLink county="York County" />
                <CountyLink county="Berks County" />
              </div>
              <div className="col-lg-6 col-xl-4 d-none d-xl-block text-truncate">
                <CountyLink county="Westmoreland County" />
                <CountyLink county="Lehigh County" />
                <CountyLink county="Luzerne County" />
                <FindMyCounty searchRef={searchRef} />
              </div>
            </div>
          </div>
          <div className="mt-3 mt-md-0 col-md-5">
            <h4 className="mb-3">Information about vaccine eligibility</h4>
            <p>
              As of January 19th, 2021, the State of Pennsylvania has approved
              giving the COVID-19 vaccine to people ages 65 and older and people
              ages 16-64 with high-risk conditions. Pennsylvania's statewide
              COVID-19 vaccination program has been evolving rapidly. You can
              find more information and links to government websites{" "}
              <Link href="/additional-resources">here</Link>.
            </p>
            <p>
              <Link href="/about-us">About VaccinatePA →</Link>
            </p>
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
