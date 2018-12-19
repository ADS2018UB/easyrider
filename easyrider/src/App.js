import React, { Component } from "react";
import { Provider, Subscribe } from "unstated";
import { Layout, Spin } from "antd";

// eslint-disable-next-line no-unused-vars
import UNSTATED from "unstated-debug";

import Map from "./components/Map";
import MapContainer from "./containers/MapContainer";
import TimeSider from "./components/TimeSider";
import Timeline from "./components/Timeline";
import Searchbar from "./components/Searchbar";
import Logo from "./components/Logo";
import AppDescription from "./components/AppDescription";
import Legend from "./components/Legend";

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
                <Sider id="sider" width="225" theme="light">
                  <Logo />
                  <AppDescription />
                  <Searchbar mapStore={mapStore} />
                  <Legend />
                  <Spin
                    id="spinner"
                    // size="large"
                    // indicator={spinIcon}
                    spinning={mapStore.state.isFetching}
                  />
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
