import { createRef } from "react";
import InTheMedia from "../components/InTheMedia";
import CountySuggestion from "../components/CountySuggestion";
import CountySearch from "../components/CountySearch";
import Layout from "../layouts/Layout";
import Image from "next/image";
import { InlineShareButtons } from "sharethis-reactjs";

export default function Index() {
  const countySearchRef = createRef();

  return (
    <Layout title="Thank You" pageStyles="thanks-page" includeFooter>
      <div className="container-md mt-5">
      <div className="d-lg-inline d-none text-nowrap">
        <img
          alt="VaccinatePA"
          className="align-middle"
          src="/images/VaccinatePALogo.svg"
          height="80"
        />
        <span className="display-1 align-middle"> Thank you.</span>
      </div>
      <div className="d-lg-none d-inline text-nowrap">
        <img
          alt="VaccinatePA"
          className="align-middle"
          src="/images/VaccinatePALogo.svg"
          height="50"
        />
        <span className="display-4 align-middle"> Thank you.</span>
      </div>
      <div className="thanks-text mx-2 mt-4">
        <p><b>VaccinatePA</b> started in January of 2021 to help Pennsylvanians find COVID-19 vaccines.</p>
        <p>Since then, over <b>450,000</b> people have visited VaccinatePA, and a team of over <b>200</b> volunteers made <b>12,000+</b> calls to vaccine providers across the state. Many of our visitors were able to find vaccines for themselves and their loved ones.</p>
        <p>It is bittersweet, but thanks to the efforts of many, our operation is no longer needed.</p>
        <p className="mt-5"><i>If you are still in need of a COVID-19 vaccine, please visit <a href="https://www.vaccines.gov/" className="thanks-link"><u>vaccines.gov</u></a></i>.</p>
      </div>
    </div>
      <style jsx>{`
        .thanks-text {
          font-size: 125%;
        }

        .thanks-page {
          background-color: #F4E7E8;
        }

        .thanks-link {
          color: #061324
        }
      `}</style>
    </Layout>
  );
}
