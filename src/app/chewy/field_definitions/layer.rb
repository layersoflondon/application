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

      field :layer_terms, type: :nested, value: -> {
        layer_terms.collect do |layer_term|
          {
            id: layer_term.id,
            name: layer_term.name,
          }
        end
      }
        
      field :layer_categories, type: :nested, value: -> {
        layer_categories.collect do |layer_category|
          {
            id: layer_category.id,
            name: layer_category.name,
            layer_terms: layer_category.layer_terms.select{|t| layer_terms.include?(t)}.collect do |layer_term|
              {
                id: layer_term.id, name: layer_term.name, layer_category_id: layer_term.layer_category_id
              }
            end
          }
        end
      }
    end
  end
end
