import AirTable from "../../components/AirTable";
import counties from "../../content/counties";
import Layout from "../../layouts/Layout";

export default function CountyPage({ county }) {
  return (
    <Layout title={county + " Availability"}>
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
        <h4 className="mt-5">Find information about {county} below:</h4>
        <AirTable county={county} />
      </div>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  return { 
    props: {
      county: params.county.replace("_", " "),
    }
  };
}

export async function getStaticPaths() {
  return {
    paths: counties.map((county) => ({ params: { county: county.replace(" ", "_") } })),
    fallback: false,
  };
}
