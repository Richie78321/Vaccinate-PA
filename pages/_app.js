import "../styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "nprogress/nprogress.css";
import Router from "next/router";
import Head from "next/head";
import NProgress from "nprogress";
import patchDOMForGoogleTranslate from "../utils/patchDOMForGoogleTranslate";

patchDOMForGoogleTranslate();

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
      <Head>
        {/*Google Analytics*/}
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

        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
              }
            `,
          }}
        ></script>
      </Head>
      <main className="d-flex flex-column h-100">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
