class LayerGroup < ApplicationRecord
  include FriendlyId

  friendly_id :name

  update_index('layer_groups') { self }

  MAX_SHORT_TITLE_LENGTH = 30
  HIGHLIGHTED_LIMIT = 4

  has_many :layers
  belongs_to :image, class_name: 'Attachments::Image', dependent: :destroy, optional: true
  accepts_nested_attributes_for :image

  validates :short_name, length: {maximum: MAX_SHORT_TITLE_LENGTH}
  validate :highlighted_limit

  def generate_export
    workbook = RubyXL::Workbook.new
    layers.group_by(&:layer_type).each_with_index do |(layer_type, layers), index|
      worksheet = workbook.worksheets[index] || workbook.add_worksheet
      worksheet.sheet_name = layer_type

      layers.each_with_index do |layer, row_index|
        worksheet.add_cell(row_index, 0, layer.title)

        layer.generate_export_data.each_with_index do |(k,v), column_index|
          worksheet.add_cell(row_index, column_index+1, v)
        end
      end
    end

    workbook.write(self.class.export_filepath(slug))
  end

  def self.highlighted_limit_reached
    where(highlighted: true).count >= HIGHLIGHTED_LIMIT
  end

  def highlighted_limit
    if self.class.highlighted_limit_reached
      errors.add(:highlighted_layer, "You've reached the limit of #{HIGHLIGHTED_LIMIT} highlighted layers")
    end
  end

  def self.export_filepath(slug = "")
    File.join(Rails.root, 'app', 'assets', 'exports', "#{slug}.xlsx")
  end

  def date_from
    if layers.any?
      layers.order(date_from: :asc).first.date_from
    else
      nil
    end
  end

  def date_to
    if layers.any?
      layers.order(date_to: :desc).first.date_to
    else
      nil
    end
  end
end
