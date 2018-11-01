import L from 'leaflet';

L.CitySelect = {};

L.CitySelect = L.Control.extend({
  options: {
    cities: ['London', 'New York', 'Chicago']
  },
  onAdd: function(map) {
		this.div = L.DomUtil.create('div', 'leaflet-cityselect-container');
		this.select = L.DomUtil.create('select', 'leaflet-cityselect', this.div);
		
    const cityKeys = this.options.cities;
    const content = cityKeys.map(c => `<option>${c}</option>`).join('');
		
		this.select.innerHTML = content;

		this.select.onmousedown = L.DomEvent.stopPropagation;
		
		return this.div;
  },
  on: function(type, handler){
		if (type == 'change'){
			this.onChange = handler;
			L.DomEvent.addListener(this.select, 'change', this._onChange, this);			
		} else if (type == 'click') {
			this.onClick = handler;
			L.DomEvent.addListener(this.select, 'click', this.onClick, this);			
		} else {
			console.log('CitySelect - cannot handle ' + type + ' events.')
		}
  },
  _onChange: function(e) {
    const selectedCity = this.select.options[this.select.selectedIndex].value;
    e.feature = selectedCity;
		this.onChange(e);
  }
});

L.citySelect = (id, options) => (new L.CitySelect(id, options));
