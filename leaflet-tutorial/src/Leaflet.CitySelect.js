import L from 'leaflet';

L.CitySelect = {};

L.CitySelect = L.Control.extend({
  options: {
    cities: ['London', 'New York', 'Chicago']
  },
  onAdd: function(map) {
		this.div = L.DomUtil.create('div','leaflet-cityselect-container');
		this.select = L.DomUtil.create('select','leaflet-cityselect',this.div);
		
    const cityKeys = this.options.cities;
    const content = cityKeys.map(c => `<option>${c}</option>`).join('');
		
		this.select.innerHTML = content;

		this.select.onmousedown = L.DomEvent.stopPropagation;
		
		return this.div;
  }
});

L.citySelect = (id, options) => (new L.CitySelect(id, options));
