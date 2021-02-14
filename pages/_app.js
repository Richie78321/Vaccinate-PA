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
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Primary Meta Tags */}
        <meta name="description" content="Find Vaccine Availability in PA" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vaccinatepa.org/" />
        <meta
          property="og:title"
          content="VaccinatePA - Pennsylvania COVID-19 Vaccine Availability"
        />
        <meta
          property="og:description"
          content="Find Vaccine Availability in PA"
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
          content="Find Vaccine Availability in PA"
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
      <main className="d-flex flex-column h-100">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
