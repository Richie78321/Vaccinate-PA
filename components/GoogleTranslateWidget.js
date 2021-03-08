import React from "react";
import Head from "next/head";

export default function GoogleTranslateWidget() {
  return (
    <>
      <Head>
        <script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        ></script>
        <link
          type="text/css"
          rel="stylesheet"
          charSet="UTF-8"
          href="https://translate.googleapis.com/translate_static/css/translateelement.css"
        />
      </Head>
      <div id="google_translate_element"></div>
    </>
  );
}
