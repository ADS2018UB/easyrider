import React, { Component } from "react";
import { Slider } from "antd";

import "./time.css";

class Timeline extends Component {
  formatter = value => {
    let res = value % 60;
    const minute = res === 0 ? "00" : res;

    res = (value - minute) / 60;
    const hour = res === 0 ? "00" : res;

    const rmin = minute === "00" ? "05" : minute + 5;
    return hour + ":" + rmin;
  };

  onAfterChange = value => {
    const { date } = this.props.mapStore.state;

    const minute = value % 60;
    const hour = (value - minute) / 60;

    this.props.mapStore.setDate(date.hour(hour).minute(minute));

    //TODO: call here the endpoint to update the map
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
          max={1430}
          onAfterChange={this.onAfterChange.bind(this)}
        />
      </div>
    );
  }
}

export default Timeline;
