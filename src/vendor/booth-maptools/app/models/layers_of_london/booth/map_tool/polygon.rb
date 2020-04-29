module LayersOfLondon::Booth::MapTool
  class Polygon < ApplicationRecord
    belongs_to :square, optional: true
    belongs_to :user

    serialize :feature, JSON

    enum colour: %w(black blue blue-hatched red-soft red-hatched red yellow unknown)

    before_save do
      colour = feature["properties"]["colour"]
      self.colour = colour.in?(LayersOfLondon::Booth::MapTool::Polygon.colours.keys) ? colour : :unknown
    end

    def to_json(user_can_edit: false)
      json_feature = {'properties' => {}}.merge(feature)
      json_feature.inject({}) do |hash, (k,v)|
        if k === 'properties'
          v.merge!({'id' => id, 'userCanEdit': user_can_edit, 'square' => square.try(:to_json), 'square_id' => square.try(:id), 'adjacent_square_ids' => Square.adjacent_range_for_id(square.try(:id))})
        end

        hash[k] = v
        hash
      end
    end
  end
end
