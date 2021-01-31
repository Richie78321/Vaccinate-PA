import React from "react";
import AirTableEmbed from "../components/AirTableEmbed";
import CountySuggestions from "../components/CountySuggestion";
import Layout from "../layouts/Layout";

export default function Index() {
  return (
    <Layout title="Vaccine Availability">
      <div className="container-fluid mt-4">
        <h2 className="mt-4">
          Find a COVID-19 vaccine for yourself or a loved one
        </h2>
        <CountySuggestions />
        <h4 className="mt-4">View all county information below:</h4>
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
        <AirTableEmbed />
      </div>
    </Layout>
  );
}
