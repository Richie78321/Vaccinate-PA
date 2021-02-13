import { createRef, useCallback } from "react";
import AirTableEmbed from "../components/AirTableEmbed";
import CountySuggestion from "../components/CountySuggestion";
import CountySearch from "../components/CountySearch";
import Layout from "../layouts/Layout";

export default function Index() {
  const countySearchRef = createRef();

  const onClickFindCounty = useCallback(() => {
    if (countySearchRef.current) {
      countySearchRef.current.focus();
    }

    return false;
  }, [countySearchRef]);

  return (
    <Layout title="Vaccine Availability">
      <div className="container-fluid mt-4">
        <h1 className="mt-4 mb-4">
          Pennsylvania COVID-19 Vaccine Availability
        </h1>
        <CountySearch searchRef={countySearchRef} />
        <p className="mt-4">
          We are a volunteer team calling hospitals and pharmacies to identify
          which facilities are currently administering vaccines. This website
          will be updated daily to reflect the latest information we are able to
          gather.
        </p>
        <p>
          Follow us on <a href="https://twitter.com/VaccinatePA">Twitter</a> and
          like us on <a href="https://www.facebook.com/vaccinatepa">Facebook</a>{" "}
          for more information.
        </p>
        <p>
          Interested in volunteering? Please{" "}
          <a href="https://forms.gle/5vyDk2tTjYUTMTXu6">sign up here</a>, and we
          will reach out to you.
        </p>
        <div className="my-4">
          <CountySuggestion searchRef={countySearchRef} />
        </div>
        <div className="mt-5 alert alert-secondary text-center">
          Please note that all vaccine availability information
          has been moved to individual county pages. You can search for your county above or by <a href="#" onClick={onClickFindCounty}>clicking here.</a>
        </div>
      </div>
    </Layout>
  );
}
