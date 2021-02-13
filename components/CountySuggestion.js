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
      <h4>Click your county to view vaccine locations</h4>
      <div className="row mt-4">
        <div className="col-md-6 col-lg-4">
          <CountyLink county="Allegheny County" />
          <CountyLink county="Montgomery County" />
          <CountyLink county="Bucks County" />
          <CountyLink county="Delaware County" />
        </div>
        <div className="col-md-6 col-lg-4">
          <CountyLink county="Lancaster County" />
          <CountyLink county="Chester County" />
          <CountyLink county="York County" />
          <div className="d-none d-lg-block">
            <CountyLink county="Berks County" />
          </div>
          <div className="d-block d-lg-none">
            <FindMyCounty searchRef={searchRef} />
          </div>
        </div>
        <div className="col-lg-4 d-none d-lg-block">
          <CountyLink county="Westmoreland County" />
          <CountyLink county="Lehigh County" />
          <CountyLink county="Luzerne County" />
          <FindMyCounty searchRef={searchRef} />
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
