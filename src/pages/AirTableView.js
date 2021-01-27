import React from "react";
import AirTable from "../components/AirTable";

export default function AirTableView() {
  return (
    <div className="container-fluid mt-4">
      <h1>Pennsylvania COVID-19 Vaccine Availability</h1>
      <p>
        As of January 19th, 2021, Pennsylvania has approved giving the COVID-19
        vaccine to people age 65 and older. We are a volunteer team calling
        hospitals and pharmacies to identify which facilities are currently
        administering vaccines. This website will be updated daily to reflect
        the latest information we are able to gather.
      </p>
      <p>
        Contact&nbsp;
        <a href="mailto:vaccinatepa2021@gmail.com">the VaccinatePA team</a>
        &nbsp;or visit our <a href="https://twitter.com/VaccinatePA">Twitter</a> for more info.
      </p>
      <h4 className="mt-5">Find information about your county below:</h4>
      <AirTable />
    </div>
  );
}
