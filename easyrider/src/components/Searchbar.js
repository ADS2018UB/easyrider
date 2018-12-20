import React, { Component } from "react";
import { Icon, Input, AutoComplete } from "antd";

const Option = AutoComplete.Option;
let selected = false;

class Searchbar extends Component {
  state = { stationName: null };

  onChange(text) {
    if (!selected) {
      this.setState({ stationName: parseInt(+text) });
    } else {
      selected = false;
      this.setState({ stationName: "" });
    }
  }

  onSelect(value) {
    this.props.mapStore.centerStation(value);
    selected = true;
  }

  filterOptions(input, option) {
    if (!isNaN(parseInt(+input))) {
      return option.props.text.indexOf(input) !== -1;
    } else if (input.length < 3) {
      return false;
    } else {
      return (
        option.props.text.toUpperCase().indexOf(input.toUpperCase()) !== -1
      );
    }
  }

  render() {
    const { stations } = this.props.mapStore.state;

    const options = stations.map(station => (
      <Option
        key={station.station_id}
        text={`${station.station_id} ${station.station_name}`}
      >
        {station.station_name}
      </Option>
    ));

    return (
      <div>
        <AutoComplete
          id="searchbar"
          dataSource={options}
          defaultActiveFirstOption={false}
          placeholder={"Search in the map"}
          value={this.state.stationName}
          onChange={this.onChange.bind(this)}
          onSearch={value => (value ? options : [])}
          onSelect={this.onSelect.bind(this)}
          filterOption={this.filterOptions}
        >
          <Input suffix={<Icon type="search" />} />
        </AutoComplete>
      </div>
    );
  }
}

export default Searchbar;
