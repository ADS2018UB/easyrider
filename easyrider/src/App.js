import React, { Component } from "react";
import Map from "./components/Map";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map id="map" pos={[41.881, -87.623]} zoom={13} />
      </div>
    );
  }
}

export default App;
