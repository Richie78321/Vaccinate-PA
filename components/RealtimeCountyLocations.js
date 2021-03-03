import { Component } from "react";
import moment from "moment";
import BeatLoader from "react-spinners/BeatLoader";

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
    this.reloadInterval = setInterval(this.fetchUpdatedLocations.bind(this), this.props.refreshSeconds ? this.props.refreshSeconds * 1000 : DEFAULT_REFRESH_TIME);
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
        console.log(resp);
        if (resp?.locations) {
          this.setState({
            lastUpdated: Date.now(),
            locations: resp.locations,
          });
        }
      })
      .catch((err) => { }) // TODO : Consider implications of failed request.
  }

  render() {
    const {
      lastUpdated,
      locations
    } = this.state;

    if (!lastUpdated) {
      return (
        <div className="text-center my-2">
          <BeatLoader size="0.5em" /> Loading Realtime Data...
        </div>
      );
    }

    return (
      <div>
        <h3 className="font-weight-normal"><u>Realtime Availability:</u></h3>
        {lastUpdated ?
          <p>Last updated {moment(lastUpdated).format('h:mm:ss a')}</p> :
          <p>Updating...</p>}
        {locations.map((location) => (
          <p key={location.id}>{location.address}</p>
        ))}
      </div>
    );
  }
}
