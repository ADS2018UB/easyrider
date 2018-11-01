import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import './Leaflet.CitySelect';

import './index.css';

const id = 'mapid';
const x = 51.505;
const y = -0.09;
const zoomLevel = 13;
const maxZoom = 18;
const providerId = 'mapbox.streets';
const accessToken = 'pk.eyJ1IjoiYWxodWVsYW1vIiwiYSI6ImNqbnVmd2x5MDA0b2wzcXBub2VycXltYXMifQ.Nle8WzhwSrsvQrDA4fiu-A';

const createDiv = divId => {
    const div = document.createElement('div');
    div.setAttribute('id', divId);
    return div;
};

document.body.appendChild(createDiv(id));

const mymap = L.map(id).setView([x, y], zoomLevel);

L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: providerId,
    maxZoom,
    accessToken
}).addTo(mymap);

const cities = L.citySelect();
cities.addTo(mymap);

const cityCoords = {
    'London': {x: 51.505, y: -0.09, z: 13},
    'New York': {x: 40.730, y: -73.935, z: 13},
    'Chicago': {x: 41.881, y: -87.623, z: 13}
};

const loadCity = city => {
    const coords = cityCoords[city];
    mymap.setView([coords.x, coords.y], coords.z);
}

const cityCallback = e => {
    const city = e.feature;
    loadCity(city);
};

cities.on('change', cityCallback);
