import { Container } from "unstated";
import moment from "moment";

/**
 * State container for the Map visualization.
 */
export default class MapContainer extends Container {
  state = {
    stations: [],
    position: { x: 41.881, y: -87.623, z: 13 },
    isFetching: false,
    date: moment("2018-10-01 12:00")
  };

  setStations = stations => {
    this.setState({ ...this.state, stations });
  };

  startDate = () => {
    this.setState({ date: moment("2018-10-01 12:00") });
  };

  setDate = date => {
    date.minute(((date.minute() / 10) >> 0) * 10);
    this.setState({ ...this.state, date });
  };

  setPos = pos => {
    console.log(pos);
    const newPos = {
      x: pos.lat || this.state.position.x,
      y: pos.lng || this.state.position.y,
      z: pos.zoom || this.state.position.z
    };
    this.setState({ ...this.state, position: newPos });
  };
}
