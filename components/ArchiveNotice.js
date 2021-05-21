import { BsInfoCircle } from "react-icons/bs";

export default function ArchiveNotice() {
  return (
    <div className="alert alert-secondary mt-4">
      <BsInfoCircle /> Please note that as of May 14th, 2021,{" "}
      <b>
        VaccinatePA is no longer actively making calls to vaccine providers to
        update the information seen below this point
      </b>
      . Some of the information below may be out of date, however realtime
      availability (above) will continue to stay up to date.
    </div>
  );
}
