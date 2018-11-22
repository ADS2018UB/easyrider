import React, { Component } from "react";
import { Slider } from "antd";
import moment from "moment";

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

  formatter(value) {
    const { day, hour } = this.state;
    const diff = this.props.step * (value - 50);

    return diff;
  }

  render() {
    const limit = 50 - 240 / this.props.step;
    console.log(limit);
    return (
      <div id="hour_slider">
        <Slider
          defaultValue={50}
          min={limit}
          max={100 - limit}
          tipFormatter={this.formatter.bind(this)}
          onChange={this.onChange.bind(this)}
          onAfterChange={this.onAfterChange.bind(this)}
        />
      </div>
    );
  }
}

export default Timeline;
