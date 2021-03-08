import React, { useEffect } from "react";
import Head from "next/head";
import patchDOMForGoogleTranslate from "../utils/patchDOMForGoogleTranslate";

// The interface for the google translate widget is extremely weird.
// WHen you load the google translate script, you provide a global function
// as a parameter which is then called on script load. Since the script loading
// does not execute on every page load, we have to do this weird stuff.
export default function GoogleTranslateWidget() {
    useEffect(() => {
        const googleTranslateElementInit = () => {
            patchDOMForGoogleTranslate();
            console.log("yo");
            new google.translate.TranslateElement(
                { pageLanguage: "en" },
                "google_translate_element"
            );
        };
        var s = document.createElement("script");
        s.setAttribute("data-google-translate", true);
        s.type = "text/javascript";
        s.async = true;
        window.googleTranslateElementInit = googleTranslateElementInit;
        s.src =
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        const scripts = document.getElementsByTagName("script");
        const hasGoogleTranslateScript =
            Array.from(scripts).filter((s) => {
                return s.getAttribute("data-google-translate");
            }).length > 0;

        // Do some Next JS optimizations, we check to see if the script tag
        // was already added for this page or not, if it isn't, we load it,
        // otherwise we init the google translate element.
        if (hasGoogleTranslateScript) {
            googleTranslateElementInit();
        } else {
            var x = document.getElementsByTagName("script")[0];
            x.parentNode.insertBefore(s, x);
        }
    });
    return (
        <>
            <Head>
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
