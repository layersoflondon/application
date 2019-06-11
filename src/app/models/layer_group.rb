class LayerGroup < ApplicationRecord
  include FriendlyId

  friendly_id :name

  update_index('layer_groups') { self }

  MAX_SHORT_TITLE_LENGTH = 30

  has_many :layers
  belongs_to :image, class_name: 'Attachments::Image', dependent: :destroy, optional: true
  accepts_nested_attributes_for :image

  validates :short_name, length: {maximum: MAX_SHORT_TITLE_LENGTH}

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

  def self.export_filepath(slug = "")
    File.join(Rails.root, 'app', 'assets', 'exports', "#{slug}.xlsx")
  end
end
