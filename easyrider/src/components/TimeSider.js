import React, { Component } from "react";
import { Button, TimePicker, DatePicker } from "antd";
import moment from "moment";

import { API_URL } from "../constants";
import "./time.css";

class TimeSider extends Component {
  disabledDate(current) {
    return current < moment("2018-09-17") || current > moment("2018-10-14");
  }

  today(ev) {
    this.props.onChangeDate(moment());
  }

  onChangeHour(hour) {
    const { date } = this.props;
    if (!date) {
      this.props.onChangeDate(hour);
    } else {
      date.hour(hour.hour()).minute(hour.minute());
    }
  }

  render() {
    const { step, date } = this.props;
    return (
      <div id="time_select">
        <div className="sider_control">
          Specific Date:
          <TimePicker
            id="hour"
            value={date}
            minuteStep={step}
            format="HH:mm"
            onChange={this.onChangeHour.bind(this)}
          />
        </div>
        <div className="sider_control">
          <Button type="primary" size="small" onClick={this.today.bind(this)}>
            Today
          </Button>
          <DatePicker
            id="date"
            value={date}
            disabledDate={this.disabledDate}
            onChange={this.props.onChangeDate}
          />
        </div>
      </div>
    );
  }
}

export default TimeSider;
