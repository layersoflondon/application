class Layer < ApplicationRecord
  enum layer_type: %i[tileserver georeferenced_image dataset polygon]
  serialize :layer_data, JSON

  update_index('layers') { self }

  validates :title, :lat, :lng, :date_from, :layer_type, :layer_data, presence: true

  belongs_to :image, class_name: 'Attachments::Image', dependent: :destroy

  attr_writer :tileserver_url

  accepts_nested_attributes_for :image

  before_validation do
    unless self.layer_type.present?
      self.layer_type = :tileserver
    end

    if @tileserver_url.present? && tileserver?
      self.layer_data = {
        url: @tileserver_url
      }
    end


  end

  def tileserver_url
    if tileserver?
      layer_data.try(:[], "url")
    end
  end
  
end
