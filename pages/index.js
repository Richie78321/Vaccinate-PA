import { createRef } from "react";
import InTheMedia from "../components/InTheMedia";
import CountySuggestion from "../components/CountySuggestion";
import CountySearch from "../components/CountySearch";
import TranslationLayout from "../layouts/TranslationLayout";
import Image from "next/image";
import {InlineShareButtons} from 'sharethis-reactjs';

const sharethisConfig = {
  alignment: 'center',
  labels: 'cta',
  color: 'white',
  enabled: true,
  networks: [ 'facebook', 'twitter', 'reddit', 'email', 'sms' ],
  radius: 4,
  size: 32,
  subject: 'VaccinatePA: Find COVID-19 Vaccine Availability',
  username: 'VaccinatePA',
};

export default function Index() {
  const countySearchRef = createRef();

  return (
    <TranslationLayout title="Vaccine Availability">
      <div className="mt-3">
        <div id="landing-header">
          <div className="container-fluid">
            <h1 className="text-center" id="landing-title">
              Pennsylvania COVID-19 Vaccine Availability
            </h1>
          </div>
          <div id="search-bar" className="container">
            <CountySearch searchRef={countySearchRef} />
          </div>
          <div className="container-fluid container-md">
            <div
              id="site-info"
              className="row justify-content-center align-items-center"
            >
              <div className="mx-5 mx-sm-0 col-sm-5 col-lg-4">
                <Image
                  src="/images/front_page_illustration.jpeg"
                  layout="responsive"
                  width={203}
                  height={166}
                />
              </div>
              <div className="mt-4 col-sm-6 col-lg-5 ml-sm-3 mt-sm-0 text-center text-sm-left">
                We are a volunteer team calling hospitals and pharmacies to
                identify which facilities are currently administering vaccines.
                This website will be updated daily to reflect the latest
                information we are able to gather.
              </div>
            </div>
          </div>
        </div>
        <InlineShareButtons config={sharethisConfig} />
        <div className="my-4">
          <CountySuggestion searchRef={countySearchRef} />
        </div>
        <div id="media-section">
          <InTheMedia />
        </div>
      </div>
      <style jsx>{`
        #landing-header {
          margin-top: 10px;
          margin-bottom: 60px;
        }

        #search-bar {
          margin-bottom: 60px;
        }

        #landing-title {
          margin-bottom: 50px;
        }

        #media-section {
          margin-top: 120px;
          margin-bottom: 80px;
        }
      `}</style>
    </TranslationLayout>
  );
}
