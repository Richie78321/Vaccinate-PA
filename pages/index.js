import React from "react";
import AirTableEmbed from "../components/AirTableEmbed";
import CountySearch from "../components/CountySearch";
import Layout from "../layouts/Layout";

export default function Index() {
  return (
    <Layout title="Vaccine Availability">
      <div className="container-fluid mt-4">
        <h1>Pennsylvania COVID-19 Vaccine Availability</h1>
        <p>
          As of January 19th, 2021, Pennsylvania has approved giving the
          COVID-19 vaccine to people age 65 and older. We are a volunteer team
          calling hospitals and pharmacies to identify which facilities are
          currently administering vaccines. This website will be updated daily
          to reflect the latest information we are able to gather.
        </p>
        <p>
          Contact&nbsp;
          <a href="mailto:vaccinatepa2021@gmail.com">the VaccinatePA team</a>
          &nbsp;or visit our{" "}
          <a href="https://twitter.com/VaccinatePA">Twitter</a> for more info.
        </p>
        <div className="alert alert-primary mt-3 mb-5 py-4">
          <h2>
            <strong>(Recommended)</strong> Search for your county here:
          </h2>
          <CountySearch />
        </div>
        <p className="mt-4 alert alert-secondary text-center">
          If you have a missing location to report, or think we have incorrect
          information,{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://airtable.com/shr7z01kc7h1ogP5R"
          >
            please let us know.
          </a>
        </p>
        <h4 className="mt-4">View all county information below:</h4>
        <AirTableEmbed />
      </div>
    </Layout>
  );
}
