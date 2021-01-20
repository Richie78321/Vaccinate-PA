import React from "react";

export default function Home() {
  const linkStyle = "underline text-blue-700";
  return (
    <div className="mt-6">
      <div className="mx-auto w-4/5">
        <h1 className="font-semibold text-3xl">
          Pennsylvania COVID-19 Vaccine Availability
        </h1>
        <p className="my-2">
          The state of Pennsylvania has approved giving the COVID-19 vaccine to
          people age 65 and older. We are calling hospitals and pharmacies to
          check which are currently adminstering vaccines.
          <br />
          <br />
          Contact{" "}
          <a href="mailto:zmwang622@gmail.com" className={linkStyle}>
            Ming
          </a>
          &nbsp;or{" "}
          <a href="mailto:rubinsteinseth@gmail.com" className={linkStyle}>
            Seth
          </a>
          &nbsp; for more info.
          <br />
          <br />
          Find your county below 🔽
        </p>
      </div>
      <iframe
        class="airtable-embed"
        title="All County Airtable Embed"
        src="https://airtable.com/embed/shr1fCiGy7sVnNixq?backgroundColor=grayLight&viewControls=on"
        frameborder="0"
        onmousewheel=""
        width="80%"
        height="533"
        className="bg-transparent border border-gray-500 mx-auto"
      />
    </div>
  );
}
