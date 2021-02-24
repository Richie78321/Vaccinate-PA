import { FaTwitter, FaFacebook } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai"

const HeartIcon = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="heart"
    style={{
      width: "1em",
      display: "inline-block",
      fontSize: "inherit",
      height: "1em",
      verticalAlign: "-.125em",
    }}
    className="inline"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    color="#F44336"
  >
    <path
      fill="currentColor"
      d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
    ></path>
  </svg>
);

export default function Footer() {
  return (
    <div className="mt-5 py-4 bg-light text-muted">
      <div className="container">
        <div id="social-icons" className="mx-auto text-center mb-3">
          <a
            href="https://twitter.com/VaccinatePA"
            target="_blank"
            rel="noreferrer"
          >
            <FaTwitter size="1.5em" />
          </a>
          <a
            href="https://www.facebook.com/vaccinatepa"
            target="_blank"
            rel="noreferrer"
            className="mx-4"
          >
            <FaFacebook size="1.5em" />
          </a>
          <a
            href="https://www.instagram.com/vaccinatepaorg/"
            target="_blank"
            rel="noreferrer"
          >
            <AiFillInstagram size="1.75em" />
          </a>
        </div>
        <p className="text-center">
          Made with {HeartIcon} by volunteer Pennsylvanians and others.
        </p>
        <p className="text-center">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdjPA82AIaW2Bo7daEUQfxRdVRsUQS3d2aWz3a26EdaSeTPUA/viewform"
          >
            Please let us know if you've found this site useful or have some
            feedback.
          </a>
        </p>
        <p className="text-center">
          Interested in volunteering? Please{" "}
          <a href="https://forms.gle/5vyDk2tTjYUTMTXu6">
            sign up to volunteer here
          </a>
          , and we will reach out to you.
        </p>
        <small>
          This site was put together by volunteers using our best efforts to
          assemble readily available data from public sources. This site does
          not provide medical advice, nor does it provide any type of technical
          advice. vaccinatepa.org is not responsible for any errors or
          omissions. vaccinatepa.org provides this information on an “as is”
          basis, with no representations or warranties of any kind, express or
          implied, including with respect to accuracy, completeness, quality,
          non-infringement, merchantability or fitness for a particular purpose.
          vaccinatepa.org will not be liable for any damages of any kind arising
          from the use of, or reliance on, any information made available on
          this site.
        </small>
      </div>
    </div>
  );
}
