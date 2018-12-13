class Station
  include Mongoid::Document
  store_in collection: 'stations'
  has_many :states, foreign_key: 'station_id', primary_key: 'station_id'

  field :station_id, type: Integer
  field :station_name, type: String
  field :address, type: String
  field :total_docks, type: Integer
  field :longitude, type: Float
  field :latitude, type: Float

  field :current_bikes, type: Integer
  field :trend, type: Array

end
