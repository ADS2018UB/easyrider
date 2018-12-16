import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as d3 from "d3";
import _ from "lodash";

// Fixing markers location (webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const icons = _.chain(_.range(0, 1001, 125))
  .keyBy()
  .mapValues(x => {
    const s = `${x}`.padStart(4, "0");
    const iconUrl = `xs/marker_xs_${s}.png`;
    const icon = L.icon({
      iconUrl,
      iconSize: [23, 32], // size of the icon
      iconAnchor: [11, 32], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -20] // point from which the popup should open relative to the iconAnchor
    });
    return icon;
  })
  .value();
const iconRanges = _.chain(icons)
  .keys()
  .map(i => parseInt(i))
  .value();

/**
 * Provides an icon given the proportion of available docks.
 * @param {int} current The current amount of occupied docks.
 * @param {int} total The total amount of docks.
 */
const selectIcon = (current, total) => {
  const q = Math.trunc((parseFloat(current) / parseFloat(total)) * 1000);
  if (q === 0 || q === 1000) {
    return icons[q];
  } else if (q > iconRanges.slice(-2, -1)[0]) {
    return icons[iconRanges.slice(-2, -1)[0]];
  } else {
    const ranges = iconRanges.slice(1, iconRanges.length - 1);
    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
      if (q <= r) {
        return icons[r];
      }
    }
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
    const data = station.trend;

    const margin = { left: 40, right: 20, top: 20, bottom: 30 };
    const width = 300 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const div = d3.create("div");

    div
      .append("text")
      .text("Adress: ")
      .append("text")
      .style("font-weight", "bold")
      .text(station.station_name);

    div.append("br");

    div
      .append("text")
      .text("ID: ")
      .append("text")
      .style("font-weight", "bold")
      .text(station.station_id);
    div.append("br");
    div
      .append("text")
      .text("Bikes: ")
      .append("text")
      .style("font-weight", "bold")
      .text(station.current_bikes);
    div.append("br");
    div
      .append("text")
      .text("Empty slots: ")
      .append("text")
      .style("font-weight", "bold")
      .text(station.total_docks - station.current_bikes);
    div.append("br");
    div.append("br");
    div
      .append("text")
      .text("PLAN YOUR TRIP: ")
      .append("hr");
    div
      .append("text")
      .text("Date: ")
      .append("text")
      .style("font-weight", "bold")
      .text(date.format("DD-MM-YYYY"));
    div.append("br");
    div
      .append("text")
      .text("Week day: ")
      .append("text")
      .style("font-weight", "bold")
      .text(date.format("dddd"));

    var svg = div
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function(d) {
          return d;
        })
      ])
      .range([height, 0]);

    // y Axis
    var yAxis = d3.axisLeft(y).ticks(4);

    g.append("g").call(yAxis);

    // text label for the y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left / 2.1)
      .attr("x", 0 - height / 2 - margin.top)
      .style("text-anchor", "middle")
      .text("Bikes");

    var x = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([0, width]);

    // x Axis
    var xAxis = d3.axisBottom(x).tickFormat(d => d + 1);

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text");

    // Label for the x axis
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (width / 2 + margin.left) +
          " ," +
          (height + margin.top + 30) +
          ")"
      )
      .style("text-anchor", "middle")
      .text("Hours");

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", height)
      .attr("height", 0)
      .attr("width", x.bandwidth() - 2)
      .attr("x", function(d, i) {
        return x(i);
      })
      .attr("fill", "steelblue")
      .transition()
      .attr("height", function(d) {
        return height - y(d);
      })
      .attr("y", function(d) {
        return y(d);
      })
      .duration(1000);

    return div.node();
  };

  /**
   * Updates the station information given a ser of station data objects.
   * @param {list of station objects} stations List of the station objects returned by the backend.
   */
  updateStations = (stations, date) => {
    _.forEach(stations, station => {
      const icon = selectIcon(station.current_bikes, station.total_docks);
      let marker = this.stationMarkers[station.station_id];
      if (marker) {
        marker.setIcon(icon);
        if (marker.isPopupOpen()) {
          this.props.mapStore
            .fetchStation(marker.properties.station_id)
            .then(remote_station => {
              const content = this.getTooltipContent(remote_station, date);
              marker.setPopupContent(content);
            });
        }
      } else {
        marker = L.marker([station.latitude, station.longitude], { icon });
        marker.addTo(this.map);
        marker
          .on("click", x => {
            const marker = x.target;
            this.props.mapStore
              .fetchStation(marker.properties.station_id)
              .then(remote_station => {
                marker.bindPopup(this.getTooltipContent(remote_station, date));
                marker.openPopup();
              });
          })
          .on("popupclose", x => {
            const marker = x.target;
            marker.unbindPopup();
          });
        marker.properties = { station_id: station.station_id };
        this.stationMarkers[station.station_id] = marker;
      }
    });
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
    const selectedId = this.props.mapStore.state.selected.station_id;
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
