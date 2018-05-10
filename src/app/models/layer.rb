class Layer < ApplicationRecord
  enum layer_type: %i[tileserver georeferenced_image dataset polygon]
  serialize :layer_data, JSON

  validates :title, :lat, :lng, :date_from, :date_to, :layer_type, :layer_data, presence: true
end
