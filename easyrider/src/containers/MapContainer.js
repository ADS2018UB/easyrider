import { Container } from "unstated";
import moment from "moment";
import fetch from "cross-fetch";
import _ from "lodash";

import { API_URL, SELECTED_ZOOM } from "../constants";

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
    selected: undefined,
    isFetching: false,
    date: moment("2018-10-01 12:00")
  };

  findStation = id =>
    _.find(this.state.stations, s => parseInt(s.station_id) === parseInt(id));

  setStations = stations => this.setState({ stations });

  startRequest = async () => {
    this.setState({ isFetching: true });
    // Send request to backend.
    const data = await fetch(`${API_URL}/stations/?date=${this.state.date}`);
    const stations = await data.json();
    // In callback, isFeching should be set to false.
    this.map.updateStations(stations, this.state.date);
    this.setState({ stations, isFetching: false });
  };

  startDate = () => {
    this.setState({ date: moment("2018-10-01 12:00") });
  };

  setDate = date => {
    date.minute(((date.minute() / 10) >> 0) * 10);
    this.setState({ date });
    this.startRequest();
  };

  setPos = (pos, zoom) => {
    const newPos = {
      x: pos.lat || this.state.position.x,
      y: pos.lng || this.state.position.y,
      z: zoom || this.state.position.z
    };
    this.setState({ position: newPos });
  };

  centerStation = async id => {
    const selected = this.findStation(id);
    if (selected) {
      const position = { x: selected.lat, y: selected.lng, z: SELECTED_ZOOM };
      await this.setState({ position, selected });
      this.map.setPos();
      this.map.openTooltip();
    }
  };
}
