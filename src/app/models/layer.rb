class Layer < ApplicationRecord
  belongs_to :layer_group

  enum layer_type: %i[tileserver georeferenced_image dataset polygon]
  serialize :layer_data, JSON

  MAX_SHORT_TITLE_LENGTH = 12
  validates :title, :lat, :lng, :date_from, :layer_type, :layer_data, presence: true
  validates :short_title, length: {maximum: MAX_SHORT_TITLE_LENGTH}

  belongs_to :image, class_name: 'Attachments::Image', dependent: :destroy
  accepts_nested_attributes_for :image

  attr_writer :tileserver_url

  after_save -> {layer_group.save}

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
