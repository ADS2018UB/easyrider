import React, { Component } from "react";
import { Provider, Subscribe } from "unstated";
// eslint-disable-next-line no-unused-vars
import UNSTATED from "unstated-debug";
import Map, { MapContainer } from "./components/Map";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Provider>
        <Subscribe to={[MapContainer]}>
          {mapStore => (
            <div className="App">
              <Map id="map" mapStore={mapStore} />
            </div>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default App;
