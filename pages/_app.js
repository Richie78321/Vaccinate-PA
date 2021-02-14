import "../styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "nprogress/nprogress.css";
import Router from "next/router";
import Head from "next/head";
import NProgress from "nprogress";

// Configure loading progress bar
NProgress.configure({ showSpinner: true });
Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/*Google Analytics*/}
      <Head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-58446605-2"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'UA-58446605-2');
              `,
          }}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Find vaccine sites in PA" />
        {/* Social Media Meta Tags */}
        <meta property="og:site_name" content="VaccinatePA" />
        <meta property="og:title" content="VaccinatePA" />
        <meta property="og:description" content="Find Vaccine Availability in PA" />
        <meta property="og:image" content="/social_media_header.png" />
        <meta property="og:url" content="https://vaccinatepa.org" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@VaccinatePA"></meta>
        <meta name="twitter:image:alt" content="Find vaccines in Pennsylvania with our volunteer-run site" />
      </Head>
      <main className="d-flex flex-column h-100">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
