import SiteNavbar from "../components/SiteNavbar";
import Footer from "../components/Footer";
import Head from "next/head";

export default function Layout({ title, children, description }) {
  const webDescription = description ? description : "Find Vaccine Availability in PA";
  
  return (
    <>
      <Head>
        <title>{title ? title + " | VaccinatePA" : "VaccinatePA"}</title>

        {/* Primary Meta Tags */}
        <meta name="description" content={webDescription} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vaccinatepa.org/" />
        <meta
          property="og:title"
          content="VaccinatePA - Pennsylvania COVID-19 Vaccine Availability"
        />
        <meta
          property="og:description"
          content={webDescription}
        />
        <meta
          property="og:image"
          content="https://vaccinatepa.org/social_media_header.png"
        />

        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://vaccinatepa.org/" />
        <meta
          property="twitter:title"
          content="VaccinatePA - Pennsylvania COVID-19 Vaccine Availability"
        />
        <meta
          property="twitter:description"
          content={webDescription}
        />
        <meta
          property="twitter:image"
          content="https://vaccinatepa.org/social_media_header.png"
        />
        <meta
          name="twitter:image:alt"
          content="Find vaccines in Pennsylvania with our volunteer-run site"
        />
      </Head>
      <div className="flex-grow-1">
        <SiteNavbar />
        {children}
      </div>
      <Footer />
    </>
  );
}
