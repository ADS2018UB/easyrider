import React, { Component } from "react";
import { Slider } from "antd";

import "./time.css";

class Timeline extends Component {
  formatter(value) {
    let res = value % 60;
    const minute = res === 0 ? "00" : res;

    res = (value - minute) / 60;
    const hour = res === 0 ? "00" : res;

    return hour + ":" + minute;
  }

  render() {
    return (
      <div>
        <Slider
          id="time_slider"
          included={false}
          step={this.props.step}
          disabled={this.props.date == null}
          value={this.props.sliderNum}
          tipFormatter={this.formatter}
          max={1430}
          onChange={this.props.onChange}
          onAfterChange={this.props.onAfterChange}
        />
      </div>
    );
  }
}

export default Timeline;
