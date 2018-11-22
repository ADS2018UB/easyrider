class Station < ApplicationRecord
  has_many :states

  attribute :current_bikes, :integer
end
