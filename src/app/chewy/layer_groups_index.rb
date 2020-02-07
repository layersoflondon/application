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
    field :date_from, type: 'date'
    field :date_to, type: 'date'
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

  def self.with_category(layer_category_id:)
    query = {
      nested: {
        path: "layers",
        query: {
          bool: {
            must: [
              { term: { "layers.layer_category_ids": layer_category_id } }
            ]
          }
        }
      }
    }

    filter(query)
  end

  def self.with_term(layer_term_id:)
    query = {
      nested: {
        path: "layers",
        query: {
          bool: {
            must: [
              { term: { "layers.layer_term_ids": layer_term_id } }
            ]
          }
        }
      }
    }

    filter(query)
  end
end
