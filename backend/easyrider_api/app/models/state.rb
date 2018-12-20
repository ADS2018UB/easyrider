class State
  include Mongoid::Document
  store_in collection: 'states'
  belongs_to :station, foreign_key: 'station_id', primary_key: 'station_id'

  field :ts, type: String
  field :available_bikes, type: Integer

end
