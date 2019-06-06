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

  def self.search(query, limit: 200)
    query = {
      bool: {
        should: [
          {
            match: {name: query}
          },
          {
            match: {description: query}
          }
        ]
      }
    }

    filter(query).limit(limit)
  end
end
