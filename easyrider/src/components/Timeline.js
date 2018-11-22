import React, { Component } from "react";
import { Slider } from "antd";

import { API_URL } from "../constants";

const format = "HH:mm";

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = { day: null, hour: null };
  }

  onChange(value) {
    console.log("onChange: ", value);
  }

  onAfterChange(value) {
    console.log("onAfterChange: ", value);
  }

  render() {
    return (
      <div id="hour_slider">
        <Slider
          defaultValue={50}
          onChange={this.onChange.bind(this)}
          onAfterChange={this.onAfterChange.bind(this)}
        />
      </div>
    );
  }
}

export default Timeline;
