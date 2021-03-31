import { Component } from 'react'
import { organizeLocations } from "../utils/DataLocal";
import { StandardLocationGroups } from './LocationGroups';
import {
  FaRegClock,
} from "react-icons/fa";
import BeatLoader from "react-spinners/BeatLoader";
import DataAnnouncements from './DataAnnouncements';
import moment from "moment";

const DISTANCE_OPTIONS_MILES = [5, 10, 15, 25, 50, 75, 100, 150];
const LOCATIONS_API = "/api/nearby";

function LatestReportsReceived({ locations }) {
  if (!locations || locations.length <= 0) {
    return null;
  }

  const latestReportTime = moment(locations[0].fields["Latest report"], true);

  return (
    <span
      className="badge badge-primary font-weight-normal text-wrap"
      style={{ fontSize: "100%" }}
    >
      <FaRegClock size="1.00em" />{" "}
      <span className="align-middle">
        Latest report received {latestReportTime.fromNow()}
      </span>
    </span>
  )
}

export default class NearbyLocations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      locations: [],
      distanceMiles: 15,
    }
 
    /**
     * Controller used to abort fetch requests if the React component is
     * unmounted during a request:
     * https://stackoverflow.com/questions/31061838/how-do-i-cancel-an-http-fetch-request
     */
     this.abortController = new AbortController();
  }

  componentDidMount() {
    this.fetchLocations();
  }

  fetchLocations() {
    const fetchParams = new URLSearchParams({
      lat: this.props.lat,
      long: this.props.long,
      distance: this.state.distanceMiles,
    });

    console.log(this.state.distanceMiles);

    fetch(`${LOCATIONS_API}?${fetchParams}`, {
      signal: this.abortController.signal,
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp?.locations) {
          this.setState({
            loading: false,
            locations: organizeLocations(resp.locations),
          });
        }
      })
      .catch((err) => {}); // TODO : Consider implications of failed request.
  }

  handleDistanceChange(event) {
    if (this.state.distanceMiles != event.target.value) {
      this.setState({ 
        loading: true,
        distanceMiles: event.target.value,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.distanceMiles != prevState.distanceMiles) {
      // Reload data. Cancel ongoing requests if needed.
      this.abortController.abort();
      this.abortController = new AbortController();
      this.fetchLocations();
    }
  }
  
  render() {
    const sharethisConfig = {
      alignment: "center",
      labels: "cta",
      color: "white",
      enabled: true,
      networks: ["facebook", "twitter", "reddit", "email", "sms"],
      radius: 4,
      size: 32,
      description: `COVID-19 Vaccine Availability Near You`,
      subject: "VaccinatePA: Find COVID-19 Vaccine Availability",
      message: `Find COVID-19 vaccine availability near you.`,
      username: "VaccinatePA",
    };

    return (
      <div>
        {!this.state.loading ? (
          <LatestReportsReceived locations={this.state.locations.allLocations} />
        ) : null }
        <div className="form-group">
          <h4 className="font-weight-normal text-center mt-3 mb-5">
            Search within{" "}
            <select id="distanceMiles" name="distanceMiles" value={this.state.distanceMiles} onChange={this.handleDistanceChange.bind(this)}>
              {DISTANCE_OPTIONS_MILES.map((distance) => <option key={distance}>{distance}</option>)}
            </select>
            {" "}miles.
          </h4>
        </div>
        <DataAnnouncements sharethisConfig={sharethisConfig} />
        {this.state.loading ? (
          <div className="text-center my-4">
            <BeatLoader size="0.5em" /> Loading...
          </div>
        ) : (
          <StandardLocationGroups locations={this.state.locations} />
        )}
      </div>
    );
  }  
}
