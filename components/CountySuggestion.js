import { Typeahead } from "react-bootstrap-typeahead";
import counties from "../content/counties";
import { useRouter } from "next/router";
import { createRef } from "React";
import CountySearch from "./CountySearch";
import Link from "next/link";

const CountyLink = ({ county }) => {
    const url = `/counties/${county.replace(" ", "_")}`;
    return (
        <Link href={url}>
            <a className="CountyLink py-2 px-3 my-3" style={{}}>
                {county}
            </a>
        </Link>
    );
};

// TODO: create better visualization of the phases

const FindMyCounty = ({ searchRef }) => {
    const onClick = () => {
        if (searchRef.current) {
            searchRef.current.focus();
        }
    };
    return (
        <a
            onClick={onClick}
            className="CountyLink py-2 px-3 my-3"
            style={{
                background: "rgb(31, 41, 55)",
                color: "white",
            }}
        >
            Find my county
        </a>
    );
};

export default function CountySuggestion() {
    const searchRef = createRef();
    const router = useRouter();

    return (
        <div>
            <CountySearch searchRef={searchRef} />
            <p className="mt-4">
                As of January 19th, 2021, Pennsylvania has approved giving the
                COVID-19 vaccine to people age 65 and older. We are a volunteer
                team calling hospitals and pharmacies to identify which
                facilities are currently administering vaccines. This website
                will be updated daily to reflect the latest information we are
                able to gather.
            </p>
            <p>
                Contact&nbsp;
                <a href="mailto:vaccinatepa2021@gmail.com">
                    the VaccinatePA team
                </a>
                &nbsp;or visit our{" "}
                <a href="https://twitter.com/VaccinatePA">Twitter</a> for more
                info.
            </p>
            <div className="CountySuggestion px-3 mt-5 mb-5 ml-n3 mr-n3  py-4">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <h4>Vaccine locations by county</h4>
                        <div>
                            <CountyLink county="Philadelphia County" />
                            <CountyLink county="Allegheny County" />
                            <CountyLink county="Montgomery County" />
                            <CountyLink county="Bucks County" />
                            <CountyLink county="Delaware County" />
                            <FindMyCounty searchRef={searchRef} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <p>
                            Click your county to the left, or use the search
                            above to find vaccine information.
                        </p>
                        <p>
                            Pennsylvania is currently in{" "}
                            <a href="https://www.health.pa.gov/topics/disease/coronavirus/Vaccine/Pages/Vaccine.aspx">
                                Phase 1A
                            </a>{" "}
                            of the vaccine rollout. This means we have begun
                            vaccinating those most at-risk of illness, such as
                            health care workers and Pennsylvanians living in
                            long-term care facilities, persons age 65 and older,
                            and those age 16-64 with high-risk conditions. See a
                            comprehensive list of Pennsylvanians included in
                            each phase here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
