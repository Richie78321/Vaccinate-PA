import { createRef, useCallback, useState } from "react";
import InTheMedia from "../components/InTheMedia";
import CountySuggestion from "../components/CountySuggestion";
import CountySearch from "../components/CountySearch";
import Layout from "../layouts/Layout";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaTwitter, FaFacebook } from "react-icons/fa";
import { Button } from "react-bootstrap";

export default function Index() {
  const countySearchRef = createRef();
  const router = useRouter();
  const [topCountyOption, setTopCountyOption] = useState(null);

  const onClickFindCounty = useCallback(() => {
    if (countySearchRef.current) {
      countySearchRef.current.focus();
    }

    return false;
  }, [countySearchRef]);

  const goToCountyIfNotNull = (counties) => {
    if (counties && counties.length > 0) {
      router.push(`counties/${counties[0].replace(" ", "_")}`);
    }
  };

  const onFindVaccineClick = () => {
    if (topCountyOption) {
      goToCountyIfNotNull([topCountyOption]);
    }
  };

  return (
    <Layout title="Vaccine Availability">
      <div className="mt-4">
        <div id="landing-header">
          <div className="container-fluid">
            <h1 className="text-center" id="landing-title">
              Pennsylvania COVID-19 Vaccine Availability
            </h1>
          </div>
          <div
            id="search-bar"
            className="container d-flex flex-md-row flex-column px-4"
          >
            <CountySearch
              className="flex-grow-1"
              searchRef={countySearchRef}
              onSearch={goToCountyIfNotNull}
              setTopCountyOption={setTopCountyOption}
            />
            <div className="ml-md-2 my-3 my-md-0 mx-md-0 mx-auto">
              <Button
                variant="warning"
                className="rounded-pill h-100"
                onClick={onFindVaccineClick}
              >
                Find Vaccine
              </Button>
            </div>
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
                <div id="social-icons" className="mt-2 mt-sm-1">
                  <a
                    href="https://twitter.com/VaccinatePA"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaTwitter size="1.5em" />
                  </a>{" "}
                  <a
                    href="https://www.facebook.com/vaccinatepa"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaFacebook className="ml-2" size="1.5em" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4">
          <CountySuggestion searchRef={countySearchRef} />
        </div>
        <div id="media-section">
          <InTheMedia />
        </div>
      </div>
      <style jsx>{`
        #landing-header {
          margin-top: 40px;
          margin-bottom: 80px;
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
    </Layout>
  );
}
