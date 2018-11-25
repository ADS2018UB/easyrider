import React, { Component } from "react";
import { Button, DatePicker } from "antd";
import moment from "moment";

import "./time.css";

class TimeSider extends Component {
  disabledDate(current) {
    return current < moment("2018-09-17") || current > moment("2018-10-15");
  }

  restart() {
    this.props.onChangeDate(moment("2018-10-01 12:00"));
  }

  setDate(day) {
    const newDate = this.props.date.add(day, "d");
    if (!this.disabledDate(newDate)) {
      this.props.onChangeDate(newDate);
    }
  }

  render() {
    const { date } = this.props;
    return (
      <div id="time_select">
        <div className="sider_control">
          <Button
            type="primary"
            size="small"
            shape="circle"
            icon="left"
            onClick={this.setDate.bind(this, -1)}
            disabled={date === null}
          />
          <Button
            id="restartButton"
            type="primary"
            size="small"
            onClick={this.restart.bind(this)}
          >
            Restart
          </Button>
          <Button
            type="primary"
            size="small"
            shape="circle"
            icon="right"
            onClick={this.setDate.bind(this, 1)}
            disabled={date === null}
          />
        </div>
        <div className="sider_input">
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
