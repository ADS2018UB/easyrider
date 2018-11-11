# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'csv'

CSV.foreach("chicago_stations.csv", headers: true) do |row|
  # row[1] ... id
  # row[2] ... name
  # row[4] ... lat
  # row[5] ... lng
  Station.create!(id: row[1], name: row[2], lat: row[4], lng: row[5])
end