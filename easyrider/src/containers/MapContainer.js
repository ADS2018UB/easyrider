import { Container } from "unstated";
import moment from "moment";
import fetch from "cross-fetch";

import { API_URL } from "../constants";

/**
 * State container for the Map visualization.
 */
export default class MapContainer extends Container {
  map = undefined;
  setMap = map => (this.map = map);

  // STATE section

  state = {
    stations: [],
    position: { x: 41.881, y: -87.623, z: 13 },
    isFetching: false,
    date: moment("2018-10-01 12:00")
  };

  setStations = stations => this.setState({ ...this.state, stations });

  startRequest = async () => {
    this.setState({ ...this.state, isFetching: true });
    // Send request to backend.
    const data = await fetch(`${API_URL}/stations/?date=${this.state.date}`);
    const stations = await data.json();
    this.setStations(stations);
    // In callback, isFeching should be set to false.
    this.map.updateStations(stations);
    this.setState({ ...this.state, isFetching: false });
  };

  startDate = () => {
    this.setState({ date: moment("2018-10-01 12:00") });
  };

  setDate = date => {
    date.minute(((date.minute() / 10) >> 0) * 10);
    this.setState({ ...this.state, date });
    this.startRequest();
  };

  setPos = (pos, zoom) => {
    const newPos = {
      x: pos.lat || this.state.position.x,
      y: pos.lng || this.state.position.y,
      z: zoom || this.state.position.z
    };
    this.setState({ ...this.state, position: newPos });
  };
}
