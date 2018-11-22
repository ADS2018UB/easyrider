import React, { Component } from "react";
import { Slider } from "antd";
import moment from "moment";

import { API_URL } from "../constants";
import "./time.css";

class Timeline extends Component {
  formatter(value) {
    const { hour, date } = this.props;

    const diff = this.props.step * (value - 50);

    const sliderDate = date ? date : moment();
    const sliderHour = hour ? hour.hour() : moment().hour();
    const sliderMinutes = hour ? hour.minute() : moment().minute();

    sliderDate.hour(sliderHour).minute(sliderMinutes + diff);

    return sliderDate.format("DD/MM/YYYY HH:mm");
  }

  render() {
    const limit = 50 - 240 / this.props.step;
    return (
      <div>
        <Slider
          id="time_slider"
          value={this.props.sliderNum}
          min={limit}
          max={100 - limit}
          tipFormatter={this.formatter.bind(this)}
          onChange={this.props.onChange}
          onAfterChange={this.props.onAfterChange}
        />
      </div>
    );
  }
}

export default Timeline;
