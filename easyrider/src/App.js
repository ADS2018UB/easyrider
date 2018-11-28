import React, { Component } from "react";
import { Provider, Subscribe } from "unstated";
import { Layout, Spin } from "antd";

// eslint-disable-next-line no-unused-vars
import UNSTATED from "unstated-debug";

import Map from "./components/Map";
import MapContainer from "./containers/MapContainer";
import TimeSider from "./components/TimeSider";
import Timeline from "./components/Timeline";
import "./App.css";

const { Footer, Sider, Content } = Layout;

class App extends Component {
  render() {
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
                    <Timeline mapStore={mapStore} />
                  </Footer>
                </Layout>
                <Sider width="225" theme="light">
                  <Spin spinning={mapStore.state.isFetching} />
                  <TimeSider mapStore={mapStore} />
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
