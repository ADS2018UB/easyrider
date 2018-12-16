import React, { Component } from "react";
import { Slider } from "antd";

import "./time.css";

class Timeline extends Component {
  formatter = value => {
    let res = value % 60;
    const minute = res === 5 ? "05" : res;

    res = (value - minute) / 60;
    const hour = res < 10 ? "0" + res : res;

    return hour + ":" + minute;
  };

  onAfterChange = value => {
    const { date } = this.props.mapStore.state;

    const minute = value % 60;
    const hour = (value - minute) / 60;

    this.props.mapStore.setDate(date.hour(hour).minute(minute));
  };

  render() {
    const { date } = this.props.mapStore.state;

    const minuteStep = 10;
    const defSliderNum = 60 * date.hour() + date.minute();

    return (
      <div>
        <Slider
          id="time_slider"
          included={false}
          step={minuteStep}
          defaultValue={defSliderNum}
          tipFormatter={this.formatter}
          min={5}
          max={1435}
          onAfterChange={this.onAfterChange.bind(this)}
        />
      </div>
    );
  }
}

export default Timeline;
