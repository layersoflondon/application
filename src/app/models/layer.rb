class Layer < ApplicationRecord
  belongs_to :layer_group

  enum layer_type: %i[tileserver georeferenced_image dataset polygon]
  serialize :layer_data, JSON

  MAX_SHORT_TITLE_LENGTH = 12
  validates :title, :layer_type, :layer_data, presence: true
  validates :short_title, length: {maximum: MAX_SHORT_TITLE_LENGTH}
  validate :lat, :lng, :date_from, unless: -> {layer_type =~ /(polygon)/}

  belongs_to :image, class_name: 'Attachments::Image', dependent: :destroy, optional: true
  accepts_nested_attributes_for :image

  belongs_to :collection, optional: true

  attr_writer :tileserver_url

  # ensure we're storing JSON in our points (or other non-stringy) layer_data
  before_save -> {
    key, val = layer_data.first
    return unless val.is_a?(String) && ['points'].include?(key.to_s)
    self.layer_data = layer_data.inject({}){|h, (k,v)| h[k] = JSON.parse(v) ; h}
  }

  after_save -> {layer_group.save}
  after_destroy -> {layer_group.save}

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
