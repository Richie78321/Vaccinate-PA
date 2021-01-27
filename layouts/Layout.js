import SiteNavbar from "../components/SiteNavbar";
import Footer from "../components/Footer";
import Head from "next/head";

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + " | VaccinatePA" : "VaccinatePA"}</title>
      </Head>
      <div className="flex-grow-1">
        <SiteNavbar />
        {children}
      </div>
      <Footer />
    </>
  )
}
