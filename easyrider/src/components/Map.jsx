import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";

// Fixing markers location (webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

class Map extends React.Component {
  componentWillMount() {
    const path = require(`../data/chicago_stations.csv`);
    console.log(path);
    Papa.parse(path, {
      header: true,
      download: true,
      delimiter: ",",
      // skipEmptyLines: true,
      complete: this.updateData
    });
  }

  updateData(result) {
    this.stations = result.data;
  }

  componentDidMount() {
    // Create map
    this.map = L.map(this.props.id).setView(this.props.pos, this.props.zoom);
    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.marker = L.marker(this.props.pos).addTo(this.map);

    console.log(this.stations);
  }

  render() {
    return <div id={this.props.id} />;
  }
}

export default Map;
