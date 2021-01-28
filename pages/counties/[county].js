import AirTableCard from "../../components/AirTableCard";
import counties from "../../content/counties";
import Layout from "../../layouts/Layout";
import { getCountyLocations } from "../../utils/Data";
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";
import Link from "next/link"

export default function CountyPage({ county, locations }) {
  const [ locationsAvailable, locationsNotAvailable, locationsUnconfirmed ] = locations;

  return (
    <Layout title={county + " Vaccine Availability"}>
      <div className="container-fluid mt-4">
        <h1>{county} COVID-19 Vaccine Availability</h1>
        <p>
          As of January 19th, 2021, Pennsylvania has approved giving the COVID-19
          vaccine to people age 65 and older. We are a volunteer team calling
          hospitals and pharmacies to identify which facilities are currently
          administering vaccines. This website will be updated daily to reflect
          the latest information we are able to gather.
        </p>
        <p>
          Contact&nbsp;
          <a href="mailto:vaccinatepa2021@gmail.com">the VaccinatePA team</a>
          &nbsp;or visit our <a href="https://twitter.com/VaccinatePA">Twitter</a> for more info.
        </p>
        <div className="d-flex flex-column">
          { locationsAvailable.length === 0 && locationsNotAvailable.length === 0 && locationsUnconfirmed.length === 0 ?
            <>
              <h2 className="text-center mt-5">We currently have no locations for {county} on record.</h2>
              <h2 className="text-center">You can view all counties <Link href="/">here</Link>.</h2>
            </>: null }
          { locationsAvailable.length > 0 ?
            <>
              <h4 className="text-success font-weight-bold mb-3">
                <FaCheckCircle /> <span className="align-middle">Vaccines reported available</span>
              </h4>
              {locationsAvailable.map((location) => 
              <div key={location.id} className="my-1">
                <AirTableCard location={location} />
              </div>)}
            </>: null }
          { locationsNotAvailable.length > 0 ?
            <>
              <h4 className="text-danger font-weight-bold my-3">
                <FaTimesCircle /> <span className="align-middle">Vaccines reported unavailable</span>
              </h4>
              {locationsNotAvailable.map((location) => 
              <div key={location.id} className="my-1">
                <AirTableCard location={location} />
              </div>)}
            </>: null }
          { locationsUnconfirmed.length > 0 ?
            <>
              <h4 className="text-black font-weight-bold my-3">
                <FaQuestionCircle /> <span className="align-middle">Uncontacted locations</span>
              </h4>
              {locationsUnconfirmed.map((location) => 
              <div key={location.id} className="my-1">
                <AirTableCard location={location} />
              </div>)}
            </>: null }
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const countyDecoded = params.county.replace("_", " ");
  const countyLocations = await getCountyLocations(countyDecoded);

  return { 
    props: {
      county: countyDecoded,
      locations: countyLocations,
    },
    revalidate: 600, // 10 minutes
  };
}

export async function getStaticPaths() {
  return {
    paths: counties.map((county) => ({ params: { county: county.replace(" ", "_") } })),
    fallback: false,
  };
}
