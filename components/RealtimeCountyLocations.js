import { Component } from "react";
import moment from "moment";
import BeatLoader from "react-spinners/BeatLoader";
import { ImSpinner2 } from "react-icons/im";
import RealtimeLocationCard from "./RealtimeLocationCard";

const DEFAULT_REFRESH_TIME = 60000; // One minute
const REALTIME_API = "/api/realtime/counties/";

function countyToCountyCode(county) {
  return county.split(" ")[0].toLowerCase();
}

export default class RealtimeCountyLocations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastUpdated: null,
      locations: [],
    };

    /**
     * Controller used to abort fetch requests if the React component is
     * unmounted during a request:
     * https://stackoverflow.com/questions/31061838/how-do-i-cancel-an-http-fetch-request
     */
    this.abortController = new AbortController();
  }

  componentDidMount() {
    this.fetchUpdatedLocations();
    this.reloadInterval = setInterval(
      this.fetchUpdatedLocations.bind(this),
      this.props.refreshSeconds
        ? this.props.refreshSeconds * 1000
        : DEFAULT_REFRESH_TIME
    );
  }

  componentWillUnmount() {
    // Abort ongoing fetch requests if there are any.
    this.abortController.abort();
    clearInterval(this.reloadInterval);
  }

  fetchUpdatedLocations() {
    const fetchURL = REALTIME_API + countyToCountyCode(this.props.county);
    fetch(fetchURL, {
      signal: this.abortController.signal,
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp?.locations) {
          this.setState({
            lastUpdated: Date.now(),
            locations: resp.locations,
          });
        }
      })
      .catch((err) => {}); // TODO : Consider implications of failed request.
  }

  render() {
    const { lastUpdated, locations } = this.state;

    if (!lastUpdated) {
      return (
        <div className="text-center my-2">
          <BeatLoader size="0.5em" /> Loading Realtime Data...
        </div>
      );
    }

    if (locations.length <= 0) {
      return null;
    }

    return (
      <div className="mb-5">
        <h3 className="font-weight-normal mb-0">
          <u>Realtime Availability:</u>
        </h3>
        <p className="mb-1">
          <small>
            This information is sourced from{" "}
            <a
              href="https://www.vaccinespotter.org/"
              target="_blank"
              rel="noreferrer"
            >
              VaccineSpotter.org
            </a>{" "}
            and is updated every minute.
          </small>
        </p>
        <div className="d-flex flex-row">
          <div>
            <ImSpinner2 className="rotating" />
          </div>
          <div className="ml-1" style={{ fontSize: "110%" }}>
            Last updated {moment(lastUpdated).format("h:mma")}
          </div>
        </div>
        {locations.map((location) => (
          <div key={location.id} className="my-3">
            <RealtimeLocationCard location={location} />
          </div>
        ))}
      </div>
    );
  }
}
