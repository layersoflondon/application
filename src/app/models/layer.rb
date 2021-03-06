class Layer < ApplicationRecord
  has_many :layer_group_layers
  has_many :layer_groups, through: :layer_group_layers
  
  has_many :layer_layer_categories, dependent: :destroy
  has_many :layer_categories, through: :layer_layer_categories
  
  has_many :layer_layer_terms, dependent: :destroy
  has_many :layer_terms, through: :layer_layer_terms

  enum layer_type: %i[tileserver geojson collection]
  serialize :layer_data, JSON

  MAX_SHORT_TITLE_LENGTH = 40
  validates :title, :layer_type, presence: true
  validates :layer_data, presence: true, if: -> {persisted?}
  validates :short_title, length: {maximum: MAX_SHORT_TITLE_LENGTH}
  validates :date_from, presence: true
  # validates :lat, :lng,  presence: true
  # validate :geojson_feature_name, if: -> {layer_type === 'geojson'}

  belongs_to :image, class_name: 'Attachments::Image', dependent: :destroy, optional: true
  
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

  after_save -> {layer_groups.each(&:save)}, if: -> {layer_groups.any?}
  after_destroy -> {layer_groups.each(&:save)}, if: -> {layer_groups.any?}

  before_validation do
    unless self.layer_type.present?
      self.layer_type = :tileserver
    end

    if @tileserver_url.present? && tileserver?
      self.layer_data = {
          url: @tileserver_url
      }
    end

    remove_orphan_terms
  end

  def collection
    return nil unless layer_type === 'collection'
    return nil unless layer_data.try(:[], 'collection_id')

    collection_id = layer_data.try(:[], 'collection_id').to_i
    Collection.find(collection_id)
  end

  def tileserver_url
    if tileserver?
      layer_data.try(:[], "url")
    end
  end

  def geojson_feature_name
    errors.add(:feature_name, "not present") unless layer_data.try(:[], 'feature_name').present?
  end

  def generate_export_data
    description_text = Nokogiri::HTML.fragment(description).inner_text

    case layer_type
    when 'geojson'
      row_layer_data = {}
    when 'tileserver'
      row_layer_data = {}
    when 'collection'
      _collection = collection
      row_layer_data = {collection: _collection.try(:title), records: "#{_collection.records.size} Record".pluralize(_collection.records.size)}
    else
      row_layer_data = {}
    end

    {
        description: description_text,
        date: [date_from, date_to].map(&:to_s).reject(&:empty?).join(' - '),
        credit: credit
    }.merge(row_layer_data)
  end

  def has_category_with_terms
    layer_categories.map { |category| category.layer_terms.any? }.include? true
  end

  def remove_orphan_terms
    layer_terms.each do |term|
      term.destroy unless layer_categories.include? term.layer_category
    end
  end
end
