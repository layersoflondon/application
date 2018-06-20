class Layer < ApplicationRecord
  enum layer_type: %i[tileserver georeferenced_image dataset polygon]
  serialize :layer_data, JSON

  update_index('layers') { self }

  validates :title, :lat, :lng, :date_from, :layer_type, :layer_data, presence: true

  belongs_to :image, class_name: 'Attachments::Image', dependent: :destroy
end
