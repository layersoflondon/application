class LayerGroupsIndex < Chewy::Index
  settings analysis: {
      analyzer: {
          email: {
              tokenizer: 'keyword',
              filter: ['lowercase']
          }
      }
  }
  define_type LayerGroup do
    field :id, type: 'integer'
    field :name, type: 'text'
    field :description, type: 'text'
    field :slug, type: :keyword
    field :image, type: :object, value: -> {
      image.try(:data)
    }
    field :layers, type: :object do
      include FieldDefinitions::Layer
    end
  end
end