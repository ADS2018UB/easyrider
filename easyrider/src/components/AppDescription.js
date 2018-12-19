import React from "react";

const AppDescription = () => (
  <div id="app-description">
    <p>
      Easyrider is an app designed to empower users in Chicago so that they
      optimize when and where they use the city bicycles.
    </p>
    <p>
      Using historical data, Easyrider predicts availability and spaces every
      day for all stations on a 10 min basis.
    </p>
    <p>
      Use the search field if you want to look up a station by its name or by
      its ID.
    </p>
    <div id="legend">
      <p className="legend-item">
        <img src="xs/marker_xs_0000.png" alt="empty" />
        &nbsp;Empty Station
      </p>
      <p className="legend-item">
        <img src="xs/marker_xs_0500.png" alt="some" />
        &nbsp;Non empty station
      </p>
      <p className="legend-item">
        <img src="xs/marker_xs_1000.png" alt="full" />
        &nbsp;Full Station
      </p>
    </div>
  </div>
);

export default AppDescription;
