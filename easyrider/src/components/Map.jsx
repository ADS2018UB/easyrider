import React from "react";
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

/**
 * Builds a Leaflet icon object for the current station icons in the
 * public directory.
 * @param {string} iconUrl Url for the icon.
 */
const createIcon = iconUrl =>
  L.icon({
    iconUrl,
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -24] // point from which the popup should open relative to the iconAnchor
  });

const okIcon = createIcon("pin_white.png");
const warnIcon = createIcon("pin_yellow.png");
const koIcon = createIcon("pin_red.png");

/**
 * Provides an icon given the proportion of available docks.
 * @param {int} current The current amount of occupied docks.
 * @param {int} total The total amount of docks.
 */
const selectIcon = (current, total) => {
  const q = parseFloat(current) / parseFloat(total);
  // console.log(current, total, q);
  if (current === 0) {
    return koIcon;
  } else if (q <= 0.2) {
    return warnIcon;
  } else {
    return okIcon;
  }
};

/**
 * Map visualization component.
 */
class Map extends React.Component {
  /**
   * Creates the Leaflet map object.
   * @param {MapContainer} mapStore State store given by the parent component.
   */
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

  /**
   * Adds the stations to the map.
   * Stations are given by the API.
   * @param {MapContainer} mapStore State store given by the parent component.
   */
  addStations = async mapStore => {
    try {
      // Fetching stations.
      const data = await fetch(`${API_URL}/stations/?date=2018-10-01T12:00`);
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
          station.name
        }</b><br/>Available: <b>${
          station.current_bikes
        }</b><br/>Empty: <b>${station.capacity - station.current_bikes}</b>`;
        marker.bindPopup(tooltip_content);
        return marker;
      });
    } catch (error) {
      console.log("Error at loading the stations...\n", error);
    }
  };

  /**
   * Creates the map and adds the stations once the component is mounted.
   */
  async componentDidMount() {
    const mapStore = this.props.mapStore.state;
    // Create map
    this.createMap(mapStore);
    // Creating and setting the markers
    await this.addStations(mapStore);

    // _.forEach(this.station_markers, marker => {
    //   this.map.removeLayer(marker);
    // });

    // Events
    this.map.on("moveend", ev => {
      // console.log(this.props.mapStore);
      const newPos = ev.target.getCenter();
      const zoom = ev.target.getZoom();
      this.props.mapStore.setPos(newPos, zoom);
    });
  }

  /**
   * Updates map position given the position in the state.
   * Needs to be manually called.
   */
  setPos = () => {
    const state = this.props.mapStore.state;
    this.map.setView([state.position.x, state.position.y], state.position.z);
  };

  render() {
    // const mapStore = this.props.mapStore;
    return <div id={this.props.id} />;
  }
}

export default Map;
