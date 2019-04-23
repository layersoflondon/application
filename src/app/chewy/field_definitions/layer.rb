module FieldDefinitions
  module Layer
    extend ActiveSupport::Concern

    included do
      field :title, type: 'text'
      field :description, type: 'text'
      field :credit, type: 'text'
      field :pin, type: 'geo_point', value: ->{ {lat: lat, lon: lng} }
      field :date_from, type: 'date'
      field :date_to, type: 'date'
      field :layer_type, type: 'keyword'
      field :layer_data, type: 'object'
      field :image, type: :object, value: -> {
        image.try(:data)
      }
    end

  end
end
