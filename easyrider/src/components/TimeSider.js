import React, { Component } from "react";
import { Button, TimePicker, DatePicker } from "antd";
import moment from "moment";

import { API_URL } from "../constants";
import "./time.css";

const format = "HH:mm";

class TimeSider extends Component {
  disabledDate(current) {
    return current > moment();
  }

  today(ev) {
    this.props.onChangeDate(moment());
    this.props.onChangeHour(null);
  }

  render() {
    const { step, hour, date } = this.props;
    return (
      <div id="time_select">
        <div className="sider_control">
          Specific Date:
          <TimePicker
            id="hour"
            value={hour}
            minuteStep={step}
            format={format}
            onChange={this.props.onChangeHour}
          />
        </div>
        <div className="sider_control">
          <Button type="primary" size="small" onClick={this.today.bind(this)}>
            Today
          </Button>
          <DatePicker
            id="day"
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
