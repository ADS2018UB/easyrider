import React, { Component } from "react";
import { Button, TimePicker, DatePicker } from "antd";
import moment from "moment";

import { API_URL } from "../constants";
import "./time.css";
const format = "HH:mm";

class TimeSider extends Component {
  constructor(props) {
    super(props);
    this.state = { day: null, hour: null };
  }

  disabledDate(current) {
    return current && current > moment().endOf("day");
  }

  onChangeDate(date, dateString) {
    this.setState({ day: date });
  }

  onChangeHour(hour, hourString) {
    this.setState({ hour: hour });
  }

  today(ev) {
    this.setState({ hour: null, day: moment() });
  }

  render() {
    return (
      <div id="time_select">
        <div className="sider_control">
          Specific Date:
          <TimePicker
            id="hour"
            value={this.state.hour}
            minuteStep={this.props.step}
            format={format}
            onChange={this.onChangeHour.bind(this)}
          />
        </div>
        <div className="sider_control">
          <Button type="primary" size="small" onClick={this.today.bind(this)}>
            Today
          </Button>
          <DatePicker
            id="day"
            value={this.state.day}
            disabledDate={this.disabledDate}
            onChange={this.onChangeDate.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default TimeSider;
