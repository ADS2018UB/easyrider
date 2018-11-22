import React, { Component } from "react";
import { Provider, Subscribe } from "unstated";
import { Layout } from "antd";

// eslint-disable-next-line no-unused-vars
import UNSTATED from "unstated-debug";

import Map, { MapContainer } from "./components/Map";
import TimeSider from "./components/TimeSider";
import Timeline from "./components/Timeline";
import "./App.css";

const { Header, Footer, Sider, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { date: null, hour: null, sliderNum: 50 };
  }

  render() {
    const { date, hour, sliderNum } = this.state;
    const minuteStep = 5;

    const onChangeDate = date => this.setState({ date });
    const onChangeHour = hour => this.setState({ hour });

    const onChangeSlider = value => this.setState({ sliderNum: value });
    const onAfterChangeSlider = value => this.setState({ sliderNum: value });

    return (
      <div className="App">
        <Provider>
          <Subscribe to={[MapContainer]}>
            {mapStore => (
              <Layout className="full">
                <Layout className="full">
                  <Content className="full">
                    <Map id="map" mapStore={mapStore} />
                  </Content>
                  <Footer>
                    <Timeline
                      step={minuteStep}
                      sliderNum={sliderNum}
                      onChange={onChangeSlider}
                      onAfterChange={onAfterChangeSlider}
                    />
                  </Footer>
                </Layout>
                <Sider width="300" theme="light">
                  <TimeSider
                    step={minuteStep}
                    hour={hour}
                    date={date}
                    onChangeDate={onChangeDate}
                    onChangeHour={onChangeHour}
                  />
                </Sider>
              </Layout>
            )}
          </Subscribe>
        </Provider>
      </div>
    );
  }
}

export default App;
