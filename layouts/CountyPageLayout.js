import Head from "next/head";
import Layout from "./Layout";

export default function CountyPageLayout({ county, children }) {
  return (
    <Layout title={county + " Vaccine Availability"}>
      <Head>
        {/* Open Graph / Facebook */}
        <meta
          property="og:description"
          content={`Find Vaccine Availability in ${county}, PA`}
        />

        {/* Twitter Card */}
        <meta
          property="twitter:description"
          content={`Find Vaccine Availability in ${county}, PA`}
        />
      </Head>
      {children}
    </Layout>
  );
}
