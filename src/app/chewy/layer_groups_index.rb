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
    field :short_name, type: 'text'
    field :description, type: 'text'
    field :slug, type: :keyword
    field :highlighted, type: 'boolean'
    field :image, type: :object, value: -> {
      image.try(:data)
    }
    field :layers, type: :nested, value: -> {layers.decorate} do
      include FieldDefinitions::Layer
    end
  end

  def self.search(query)
    multi_match_fields = %w[name^10 description]

    query({
      bool: {
        must: [
          {
            multi_match: {
              query: query,
              type: 'best_fields',
              fields: multi_match_fields,
              analyzer: :english
            }
          }
        ]
      }
    })
  end

  def self.highlighted(is_highlighted: true)
    filter({term: {highlighted: is_highlighted}})
  end
end
