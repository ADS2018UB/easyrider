import React, { Component } from "react";
import { Slider, TimePicker } from "antd";

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

  disabledMinutes = hour => {
    const result = [];
    for (let i = 0; i <= 59; i++) {
      if ((i + 5) % 10 !== 0) {
        result.push(i);
      }
    }
    return result;
  };

  render() {
    const { date } = this.props.mapStore.state;

    const minuteStep = 10;
    const defSliderNum = 60 * date.hour() + date.minute();
    const format = "HH:mm";
    const marks = {
      5: "00:05",
      365: "06:05",
      725: "12:05",
      1085: "18:05",
      1435: "23:55"
    };

    return (
      <div id="time_select">
        <Slider
          id="time_slider"
          included={false}
          step={minuteStep}
          marks={marks}
          defaultValue={defSliderNum}
          tipFormatter={this.formatter}
          min={5}
          max={1435}
          onAfterChange={this.onAfterChange.bind(this)}
        />
        <TimePicker
          value={date}
          format={format}
          disabledMinutes={this.disabledMinutes}
          hideDisabledOptions={true}
          allowEmpty={false}
        />
      </div>
    );
  }
}

export default Timeline;
