import React from "react";
import { Button, Icon } from "antd";

const TimeNavButtons = ({ prevCb, todayCb, nextCb }) => (
  <Button.Group size={3}>
    <Button type="primary" onClick={prevCb}>
      <Icon type="left" />
    </Button>
    <Button type="primary" onClick={todayCb}>
      Today
    </Button>
    <Button type="primary" onClick={nextCb}>
      <Icon type="right" />
    </Button>
  </Button.Group>
);

export default TimeNavButtons;
