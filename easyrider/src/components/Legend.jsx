import React from "react";

const Legend = () => (
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
);

export default Legend;
