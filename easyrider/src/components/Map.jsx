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
  stationMarkers = [];

  /**
   * Creates the Leaflet map object.
   * @param {MapContainer} mapStore State store given by the parent component.
   */
  createMap = () => {
    const { state } = this.props.mapStore;
    this.map = L.map(this.props.id).setView(
      [state.position.x, state.position.y],
      state.position.z
    );
    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  };

  /**
   * Removes all the current station markers from the map, if there's any.
   */
  removeAllStations = () =>
    _.forEach(this.stationMarkers, m => this.map.removeLayer(m));

  /**
   * Creates the tooltip content of an specific station.
   * @param {station} station whose tooltip is going to be generated.
   */
  getTooltipContent = (station, date) => {
    return `Adress: <b>${station.name}</b>
      <br />
      ID: <b>${station.id}</b>
      <br />
      Available: <b>${station.current_bikes}</b>
      <br />
      Empty: <b>${station.capacity - station.current_bikes}</b>
      <br /><br /><br />
      <b>PLAN YOUR TRIP</b>
      <hr />
      Date: <b>${date.format("DD-MM-YYYY HH:mm")}</b>
      <br />
      Week day: <b>${date.format("dddd")}</b>`;
  };
  /**
   * Updates the station information given a ser of station data objects.
   * @param {list of station objects} stations List of the station objects returned by the backend.
   */
  updateStations = (stations, date) => {
    // First, remove all the current markers.
    this.removeAllStations();
    // Setting the station markers and the tooltips.
    this.stationMarkers = _.chain(stations)
      .keyBy("id")
      .mapValues(station => {
        const icon = selectIcon(station.current_bikes, station.capacity);
        const marker = L.marker([station.lat, station.lng], { icon }).addTo(
          this.map
        );

        marker.bindPopup(this.getTooltipContent(station, date));
        return marker;
      })
      .value();
  };

  /**
   * Creates the map and adds the stations once the component is mounted.
   */
  async componentDidMount() {
    this.props.mapStore.setMap(this);
    // Create map
    this.createMap();
    // Creating and setting the markers
    await this.props.mapStore.startRequest();

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

  openTooltip = () => {
    const selectedId = this.props.mapStore.state.selected.id;
    if (selectedId) {
      this.stationMarkers[selectedId].openPopup();
    }
  };

  render() {
    // const mapStore = this.props.mapStore;
    return <div id={this.props.id} />;
  }
}

export default Map;
