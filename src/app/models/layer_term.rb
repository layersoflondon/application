class LayerTerm < ApplicationRecord
  has_many :layer_layer_terms, dependent: :destroy
  has_many :layers, through: :layer_layer_terms
  belongs_to :layer_category
end