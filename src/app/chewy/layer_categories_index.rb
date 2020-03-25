class LayerCategoriesIndex < Chewy::Index
  define_type LayerCategory.includes(:layer_terms) do
    field :id, type: :integer
    field :name, type: :text, analyzer: :english
    field :layer_terms, type: :object do
      include FieldDefinitions::LayerTerm
    end
  end
end