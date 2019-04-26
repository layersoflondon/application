module FieldDefinitions
  module Layer
    extend ActiveSupport::Concern

    included do
      field :id, type: 'integer'
      field :title, type: 'text'
      field :name, type: 'text'
      field :description, type: 'text'
      field :credit, type: 'text'
      field :pin, type: 'geo_point', value: ->{ {lat: lat||0, lon: lng||0} }
      field :date_from, type: 'date'
      field :date_to, type: 'date'
      field :layer_type, type: 'keyword'
      field :layer_data, type: 'object'
      field :collection_id, type: 'integer'
      field :image, type: :object, value: -> {
        image.try(:data)
      }
    end
  end
end
