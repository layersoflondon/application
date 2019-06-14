class LayerGroupsIndex < Chewy::Index
  define_type LayerGroup do
    field :id, type: 'integer'
    field :name, type: 'text', analyzer: :english
    field :short_name, type: 'text', analyzer: :english
    field :description, type: 'text', analyzer: :english
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
    multi_match_fields = %w[name^2 short_name description]

    query({
            bool: {

              should: [
                {
                  multi_match: {
                    query: query,
                    fields: multi_match_fields,
                    type: 'best_fields',
                    fuzziness: 'AUTO'
                  }
                },
                {
                  multi_match: {
                    query: query,
                    fields: multi_match_fields,
                    type: 'phrase'

                  }
                },
                {
                  multi_match: {
                    query: query,
                    fields: multi_match_fields,
                    operator: 'and'
                  }
                }
              ],
              minimum_should_match: 1
            }
          })
  end

  def self.highlighted(is_highlighted: true)
    filter({term: {highlighted: is_highlighted}})
  end
end
