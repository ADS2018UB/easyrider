import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import _ from "lodash";

// Fixing markers location (webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

class Map extends React.Component {
  componentWillMount() {
    this.stations = require(`../data/chicago_stations.csv`);
  }

  componentDidMount() {
    // Create map
    this.map = L.map(this.props.id).setView(this.props.pos, this.props.zoom);
    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    console.log(this.stations);
    this.station_markers = _.map(this.stations, station => {
      const marker = L.marker([station.lat, station.lon]).addTo(this.map);
      const tooltip_content = `Id: <b>${station.id}</b><br/>Name: <b>${
        station.station_name
      }</b>`;
      marker.bindPopup(tooltip_content);
      return marker;
    });
  }

  render() {
    return <div id={this.props.id} />;
  }
}

export default Map;
