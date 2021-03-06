class LayerGroupsIndex < Chewy::Index
  define_type LayerGroup.includes(layers: [:layer_terms, layer_categories: [:layer_terms]]).references(layers: [:layer_terms, layer_categories: [:layer_terms]]) do
    field :id, type: 'integer'
    field :name, type: 'text', analyzer: :english
    field :short_name, type: 'text', analyzer: :english
    field :description, type: 'text', analyzer: :english
    field :slug, type: :keyword
    field :highlighted, type: 'boolean'
    field :boost_factor, type: 'integer', value: -> { highlighted? ? 1 : 0 }
    field :image, type: :object, value: -> {
      image.try(:data)
    }
    field :layers, type: :nested, value: -> { layers.decorate } do
      include FieldDefinitions::Layer
    end
    field :date_from, type: 'date'
    field :date_to, type: 'date'
  end

  def self.sorted_by_date
    query = {


      function_score: {
        functions: [
          {
            field_value_factor: {
              field: "date_from",
              factor: -0.000000001,
              missing: 0
            }
          }
        ],
        score_mode: 'sum'

      }

    }
    query(query)
  end

  def self.boost_highlight
    query = {


      function_score: {
        functions: [
          {
            field_value_factor: {
              field: "boost_factor",
              factor: 1000000,
              missing: 0
            }
          }
        ]
      }

    }

    query(query)
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
                    type: 'best_fields'
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

  def self.highlighted
    filter({term: {highlighted: true}})
  end

  def self.with_category_id(layer_category_id)
    query = {
      nested: {
        path: "layers",
        query: {
          bool: {
            must: [
              {term: {"layers.layer_category_ids": layer_category_id}}
            ]
          }
        }
      }
    }

    filter(query)
  end

  def self.with_term_id(layer_term_id)
    filter = {
      bool: {
        must: [
          {
            nested: {
              path: "layers",
              query: {
                bool: {
                  must: [
                    {term: {"layers.layer_term_ids": layer_term_id}}
                  ]
                }
              }
            }
          }


        ]
      }

    }
    filter(filter)
  end
end
