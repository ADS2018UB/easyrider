import React, { Component } from "react";
import { Provider, Subscribe } from "unstated";
import { Layout, Spin, Icon } from "antd";

// eslint-disable-next-line no-unused-vars
import UNSTATED from "unstated-debug";

import Map from "./components/Map";
import MapContainer from "./containers/MapContainer";
import TimeSider from "./components/TimeSider";
import Timeline from "./components/Timeline";
import Searchbar from "./components/Searchbar";
import Logo from "./components/Logo";
import AppDescription from "./components/AppDescription";

import "./App.css";

const { Footer, Sider, Content } = Layout;

const spinIcon = <Icon type="loading" style={{ fontSize: 48 }} spin />;

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
                  <Logo />
                  <AppDescription />
                  <Searchbar mapStore={mapStore} />
                  <Spin
                    id="spinner"
                    size="large"
                    indicator={spinIcon}
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
