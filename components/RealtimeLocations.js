import { Component } from "react";
import moment from "moment";
import BeatLoader from "react-spinners/BeatLoader";
import { ImSpinner2 } from "react-icons/im";
import RealtimeLocationCard from "./RealtimeLocationCard";
import Link from "next/link";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

const DEFAULT_REFRESH_TIME = 60000; // One minute
const VISIBILITY_INCREMENT = 10;
const DEFUALT_NUM_VISIBLE = 5;

export default class RealtimeLocations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastUpdated: null,
      locations: [],
      numVisible: DEFUALT_NUM_VISIBLE,
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
    fetch(this.props.apiURL, {
      signal: this.abortController.signal,
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp?.locations) {
          const updateTime = Date.now();
          this.setState({
            lastUpdated: updateTime,
            locations: resp.locations,
          });

          if (resp.locations.length > 0) {
            this.props.updateLatestReportTime(
              resp.locations[0].properties?.appointments_last_fetched
            );
          }
        }
      })
      .catch((err) => {}); // TODO : Consider implications of failed request.
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.apiURL !== this.props.apiURL) {
      this.fetchUpdatedLocations();
    }
  }

  onShowMore(e) {
    this.setState({
      numVisible: this.state.numVisible + VISIBILITY_INCREMENT,
    });

    // Prevent refresh from link click
    e.preventDefault();
  }

  onShowLess(e) {
    this.setState({
      numVisible: DEFUALT_NUM_VISIBLE,
    });

    // Prevent refresh from link click
    e.preventDefault();
  }

  render() {
    const { lastUpdated, locations, numVisible } = this.state;

    if (!lastUpdated) {
      return (
        <div className="text-center my-2">
          <BeatLoader size="0.5em" /> Loading Realtime Data...
        </div>
      );
    }

    return (
      <div className={locations.length <= 0 ? "mb-0" : "mb-2"}>
        <h3 className="font-weight-normal mb-0">
          <u>Realtime availability:</u>
        </h3>
        <p className="mb-2" style={{ lineHeight: "100%", marginTop: "4px" }}>
          <small>
            Realtime availability is updated every minute.{" "}
            <Link href="/about-us#where-does-real-time-availability-information-come-from-">
              Learn more
            </Link>
          </small>
        </p>
        <div className="d-flex flex-row">
          <div>
            <ImSpinner2 className="rotating" />
          </div>
          <div className="ml-1" style={{ fontSize: "110%" }}>
            Last {locations.length <= 0 ? "checked" : "updated"}{" "}
            {moment(lastUpdated).format("h:mma")}
          </div>
        </div>
        {locations.map((location, index) =>
          index < numVisible ? (
            <div key={location.properties.id} className="my-3">
              <RealtimeLocationCard location={location} />
            </div>
          ) : null
        )}
        <div className="text-center mt-4">
          {numVisible < locations.length ? (
            <button
              onClick={this.onShowMore.bind(this)}
              className="btn btn-light border-primary"
            >
              <AiOutlinePlusCircle size="1.2em" />
              <span className="ml-2 align-middle" style={{ fontSize: "115%" }}>
                Show{" "}
                {Math.min(VISIBILITY_INCREMENT, locations.length - numVisible)}{" "}
                more results
              </span>
            </button>
          ) : numVisible > DEFUALT_NUM_VISIBLE ? (
            <button
              onClick={this.onShowLess.bind(this)}
              className="btn btn-light border-primary"
            >
              <AiOutlineMinusCircle size="1.2em" />
              <span className="ml-2 align-middle" style={{ fontSize: "115%" }}>
                Show less results
              </span>
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}
