import React, { Component } from "react";
import { Provider, Subscribe } from "unstated";
import { Layout } from "antd";

// eslint-disable-next-line no-unused-vars
import UNSTATED from "unstated-debug";

import Map, { MapContainer } from "./components/Map";
import TimeSider from "./components/TimeSider";
import Timeline from "./components/Timeline";
import Searchbar from "./components/Searchbar";

import "./App.css";

const { Header, Footer, Sider, Content } = Layout;

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
                  <Searchbar mapStore={mapStore} />
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
