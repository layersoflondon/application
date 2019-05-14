class Layer < ApplicationRecord
  belongs_to :layer_group, optional: true

  enum layer_type: %i[tileserver geojson collection]
  serialize :layer_data, JSON

  MAX_SHORT_TITLE_LENGTH = 12
  validates :title, :layer_type, presence: true
  validates :layer_data, presence: true
  validates :short_title, length: {maximum: MAX_SHORT_TITLE_LENGTH}
  validates :date_from, presence: true
  # validates :lat, :lng,  presence: true
  validate :geojson_feature_name

  belongs_to :collection, optional: true
  belongs_to :image, class_name: 'Attachments::Image', dependent: :destroy
  
  attr_writer :tileserver_url

  enum vector_layer_colours: {
      aqua: '#7FDBFF',
      blue: '#0074D9',
      navy: '#001F3F',
      teal: '#39CCCC',
      green: '#2ECC40',
      olive: '#3D9970',
      lime: '#01FF70',
      red: '#FF4136',
      fuchsia: '#F012BE',
      purple: '#B10DC9',
      maroon: '#85144B'
  }

  # ensure we're storing JSON in our points (or other non-stringy) layer_data
  # before_save -> {
  #   key, val = layer_data.first
  #   return unless val.is_a?(String) #&& ['points'].include?(key.to_s)
  #   self.layer_data = layer_data.inject({}){|h, (k,v)| h[k] = JSON.parse(v) ; h}
  # }, unless: -> {layer_type === 'dataset'}

  before_save -> {
    return unless layer_data.try(:[], :vector_tiles) === 'true'
    return unless layer_data.is_a?(Hash)

    layer_data['vector_layer_colour'] = self.class.vector_layer_colours.values.first unless layer_data.has_key?('vector_layer_colour')
  }

  after_save -> {layer_group.save}, if: -> {layer_group.present?}
  after_destroy -> {layer_group.save}, if: -> {layer_group.present?}

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

  def geojson_feature_name
    errors.add(:feature_name, "not present") unless layer_data.try(:[], 'feature_name').present?
  end
end
