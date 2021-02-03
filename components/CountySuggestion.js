import { Typeahead } from "react-bootstrap-typeahead";
import counties from "../content/counties";
import { useRouter } from "next/router";
import { createRef } from "React";
import CountySearch from "./CountySearch";
import Link from "next/link";

const CountyLink = ({ county }) => {
  const url = `/counties/${county.replace(" ", "_")}`;
  return (
    <Link href={url}>
      <a className="CountyLink py-2 px-3 mb-3" style={{}}>
        {county}
      </a>
    </Link>
  );
};

const FindMyCounty = ({ searchRef }) => {
  const onClick = () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };
  return (
    <a
      onClick={onClick}
      className="CountyLink py-2 px-3 mb-3"
      style={{
        background: "rgb(31, 41, 55)",
        color: "white",
      }}
    >
      Find my county
    </a>
  );
};

export default function CountySuggestion() {
  const searchRef = createRef();
  const router = useRouter();

  return (
    <div>
      <CountySearch searchRef={searchRef} />
      <p className="mt-4">
        We are a volunteer team calling hospitals and pharmacies to identify
        which facilities are currently administering vaccines. This website will
        be updated daily to reflect the latest information we are able to
        gather.
      </p>
      <p>
        Contact&nbsp;
        <a href="mailto:vaccinatepa2021@gmail.com">the VaccinatePA team</a>
        &nbsp;or visit our <a href="https://twitter.com/VaccinatePA">
          Twitter
        </a>{" "}
        for more info.
      </p>
      <div className="CountySuggestion px-3 px-sm-5 mt-5 mb-5 py-4">
        <div className="row">
          <div className="col-md-6">
            <h4 className="mb-3">
              More information about vaccine availability
            </h4>
            <p>
              As of January 19th, 2021, the State of Pennsylvania has approved
              giving the COVID-19 vaccine to people age 65 and older.
              Pennsylvania's statewide COVID-19 vaccination program has been
              evolving rapidly. You can find more information and links to
              government websites <Link href="/additional-resources">here</Link>
              . We are a community-led website and do not represent the
              government or any healthcare provider.
              <p className="mt-3 underline">
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
      </div>
    </div>
  );
}
