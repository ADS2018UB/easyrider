import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const marker = L.marker([51.5, -0.09]).addTo(mymap);
