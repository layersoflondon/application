class LayerGroup < ApplicationRecord
  include FriendlyId

  friendly_id :name

  update_index('layer_groups') { self }

  has_many :layers
  belongs_to :image, class_name: 'Attachments::Image', dependent: :destroy
  accepts_nested_attributes_for :image
end
