module LayersOfLondon::Booth::MapTool
  class Polygon < ApplicationRecord
    belongs_to :square, optional: true
    belongs_to :user

    serialize :feature, JSON

    def to_json(user_can_edit: false)
      json_feature = {'properties' => {}}.merge(feature)
      json_feature.inject({}) do |hash, (k,v)|
        if k === 'properties'
          v.merge!({'id' => id, 'userCanEdit': user_can_edit, 'square' => square.try(:to_json)})
        end

        hash[k] = v
        hash
      end
    end
  end
end
