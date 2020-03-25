module FieldDefinitions
  module LayerTerm
    extend ActiveSupport::Concern
    included do
      field :id, type: 'integer'
      field :name, type: 'text', analyzer: :english
      field :layer_category_id, type: :integer
    end
  end
end