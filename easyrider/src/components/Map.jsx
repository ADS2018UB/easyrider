import React from "react";
import { Container } from "unstated";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import _ from "lodash";

import { API_URL } from "../constants";

// Fixing markers location (webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export class MapContainer extends Container {
  state = {
    stations: [],
    position: { x: 41.881, y: -87.623, z: 13 },
    isFetching: false
  };

  setStations = stations => {
    this.setState({ ...this.state, stations });
  };
}

class Map extends React.Component {
  createMap = mapStore => {
    this.map = L.map(this.props.id).setView(
      [mapStore.position.x, mapStore.position.y],
      mapStore.position.z
    );
    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  };

  addStations = async mapStore => {
    try {
      // Fetching stations.
      const data = await fetch(`${API_URL}/stations`);
      const stations = await data.json();
      // Updating the state.
      this.props.mapStore.setStations(stations);

      // Setting station markers.
      this.station_markers = _.map(stations, station => {
        const marker = L.marker([station.lat, station.lng]).addTo(this.map);
        const tooltip_content = `Id: <b>${station.id}</b><br/>Name: <b>${
          station.station_name
        }</b>`;
        marker.bindPopup(tooltip_content);
        return marker;
      });
    } catch (error) {
      console.log("Error at loading the stations...\n", error);
    }
  };

  async componentDidMount() {
    const mapStore = this.props.mapStore.state;
    // Create map
    this.createMap(mapStore);
    // Creating and setting the markers
    await this.addStations(mapStore);

    // _.forEach(this.station_markers, marker => {
    //   this.map.removeLayer(marker);
    // });
  }

  render() {
    // const mapStore = this.props.mapStore;
    return <div id={this.props.id} />;
  }
}

export default Map;
