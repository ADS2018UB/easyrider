import React, { Component } from "react";
import { Button, DatePicker, Tag } from "antd";
import moment from "moment";

import "./time.css";

class TimeSider extends Component {
  disabledDate(current) {
    return current < moment("2018-09-17") || current > moment("2018-10-15");
  }

  addDay(num) {
    const newDate = moment(this.props.mapStore.state.date).add(num, "d");
    if (!this.disabledDate(newDate)) {
      this.props.mapStore.setDate(newDate);
    }
  }

  render() {
    const { date } = this.props.mapStore.state;
    const { startDate, setDate } = this.props.mapStore;

    const prediction = date >= moment("2018-10-01 00:05");

    return (
      <div id="date_select">
        {prediction ? (
          <Tag className="indicator" color="gold">
            PREDICTION
          </Tag>
        ) : (
          <Tag className="indicator" color="cyan">
            HISTORICAL
          </Tag>
        )}
        <div className="sider_control">
          <Button
            type="primary"
            size="small"
            shape="circle"
            icon="left"
            onClick={this.addDay.bind(this, -1)}
          />
          <Button
            id="restartButton"
            type="primary"
            size="small"
            onClick={startDate}
          >
            Restart
          </Button>
          <Button
            type="primary"
            size="small"
            shape="circle"
            icon="right"
            onClick={this.addDay.bind(this, 1)}
          />
        </div>
        <div className="sider_input">
          <DatePicker
            id="date"
            value={date}
            disabledDate={this.disabledDate}
            onChange={setDate}
          />
        </div>
      </div>
    );
  }
}

export default TimeSider;
