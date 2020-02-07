class LayerCategory < ApplicationRecord
  has_many :layer_layer_categories
  has_many :layers, through: :layer_layer_categories
  has_many :layer_terms
end