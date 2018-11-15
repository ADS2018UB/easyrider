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

const okIcon = L.icon({
  iconUrl: "pin_blue.png",
  // shadowUrl: 'leaf-shadow.png',

  iconSize: [64, 64], // size of the icon
  // shadowSize: [50, 64], // size of the shadow
  iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [0, -48] // point from which the popup should open relative to the iconAnchor
});

const koIcon = L.icon({
  iconUrl: "pin_red.png",
  // shadowUrl: 'leaf-shadow.png',

  iconSize: [64, 64], // size of the icon
  // shadowSize: [50, 64], // size of the shadow
  iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [0, -48] // point from which the popup should open relative to the iconAnchor
});

const selectIcon = (current, total) => {
  const q = parseFloat(current) / parseFloat(total);
  console.log(current, total, q);
  return q <= 0.2 ? koIcon : okIcon;
};

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
      const data = await fetch(`${API_URL}/stations/?date=2018-01-02T12:00`);
      const stations = await data.json();

      // Updating the state.
      this.props.mapStore.setStations(stations);

      // Setting station markers.
      this.station_markers = _.map(stations, station => {
        const icon = selectIcon(station.current_bikes, station.capacity);
        const marker = L.marker([station.lat, station.lng], { icon }).addTo(
          this.map
        );
        const tooltip_content = `Id: <b>${station.id}</b><br/>Name: <b>${
          station.station_name
        }</b><br/>Available: <b>${station.current_bikes}</b><br/>Capacity: <b>${
          station.capacity
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
