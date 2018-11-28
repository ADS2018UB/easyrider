import React, { Component } from "react";
import { Icon, Input, AutoComplete } from "antd";

const Option = AutoComplete.Option;

class Searchbar extends Component {
  onSelect(value) {
    console.log("onSelect", value);
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
      <Option key={station.id} text={`${station.id} ${station.name}`}>
        {station.name}
      </Option>
    ));

    return (
      <div id="searchbar">
        <AutoComplete
          dataSource={options}
          placeholder={"Search in the map"}
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
