class MultiIndexSearch
  INDEXES = [
    RecordsIndex,
    CollectionsIndex
  ]

  def self.highlighted(params = {})
    es_query = Chewy::Search::Request.new(*INDEXES).filter(terms: {state: ['published']})
    es_query = es_query.query({term: {featured_item: true}}).limit(100)
    
    es_query = es_query.limit(params[:limit]) if params[:limit]

    es_query
  end

  def self.popular(params = {})
    # self.query({q: "popular"}, limit: (params[:limit] || 6)) # fixme: make this do a proper query
    es_query = Chewy::Search::Request.new(*INDEXES).filter(terms: {state: ['published']})
    es_query = es_query.order(view_count: :desc)

    es_query = es_query.limit(params[:limit]) if params[:limit]

    es_query
  end

  def self.filter_by_geobounds(search_params, indexes: INDEXES, limit: 100)
    if search_params[:q]
      es_query = self.query(search_params, indexes: indexes, limit: limit)
    else
      es_query = Chewy::Search::Request.new(*indexes)
    end

    if search_params[:geobounding].present?
      es_query = add_geobounding_filter(search_params[:geobounding], es_query)
    end

    es_query = filter_by_state(es_query)
    es_query.limit(limit)
  end

  def self.filter_by_date_range(search_params, indexes: INDEXES, limit: 100)
    if search_params[:q]
      es_query = self.query(search_params, indexes: indexes, limit: limit)
    else
      es_query = Chewy::Search::Request.new(*indexes)
    end

    if search_params[:date_range].present?
      es_query = es_query.query(
        'bool': {
          'should': [
            {
              'range': {
                'date_from': {
                  'gte': search_params[:date_range][:gte],
                  'lte': search_params[:date_range][:lte],
                  'format': 'yyyy-MM-dd'
                }
              }
            }
          ]
        }
      )
    end

    es_query
  end

  def self.query(search_params, indexes: INDEXES, limit: 100)
    multi_match_fields = %w[title^10 description]


    es_query = Chewy::Search::Request.new(*indexes).query(
        {
          bool: {
            must: [
              {
                multi_match: {
                  query: search_params[:q],
                  type: "best_fields",
                  fields: multi_match_fields,
                  analyzer: :english

                }
              }
            ],
            should: [
              {
                multi_match: {
                  query: search_params[:q],
                  fields: multi_match_fields,
                  type: 'phrase',
                  boost: 10,
                  analyzer: :english
                }
              },
              {
                multi_match: {
                  query: search_params[:q],
                  fields: multi_match_fields,
                  operator: 'and',
                  boost: 5,
                  analyzer: :english
                }
              }
            ]
          }
        }
    )

    es_query = boost_collections(es_query)
    es_query = boost_popular(es_query) if search_params[:popular]


    if search_params[:attachment_type].present?
      search_params[:attachment_type].each do |type|
        es_query = es_query.filter('term': { 'attachments.attachable_type': type })
      end
    end

    if search_params[:type].present?
      search_params[:type].each do |type|
        es_query = es_query.filter('term': { 'taxonomy_terms.name': type })
      end
    end

    if search_params[:theme].present?
      search_params[:theme].each do |theme|
        es_query = es_query.filter('term': { 'taxonomy_terms.name': theme })
      end
    end

    if search_params[:date_range].present?
      es_query = es_query.query(
        'bool': {
          'should': [
            {
              'range': {
                'date_from': {
                  'gte': search_params[:date_range][:gte],
                  'lte': search_params[:date_range][:lte],
                  'format': 'yyyy-MM-dd'
                }
              }
            }
          ]
        }
      )
    end

    if search_params[:geobounding].present?
      es_query = add_geobounding_filter(search_params[:geobounding], es_query)
    end

    es_query = filter_by_state(es_query)
    es_query = es_query.limit(limit)
    es_query
  end

  private
  def self.add_geobounding_filter(geobounding, query)
    top_left = geobounding[:top_left]
    bottom_right = geobounding[:bottom_right]
    top_left_lat = top_left[:lat]
    top_left_lng = top_left[:lng]
    bottom_right_lat = bottom_right[:lat]
    bottom_right_lng = bottom_right[:lng]

    query.filter('geo_bounding_box': {
      'pin': {
        'top_left': {
          'lat': top_left_lat,
          'lon': top_left_lng
        },
        'bottom_right': {
          'lat': bottom_right_lat,
          'lon': bottom_right_lng
        }
      }
    })
  end

  def self.filter_by_state(query, states: ['published'])
    query.filter(terms: {state: states})
  end
  
  def self.tagged(tag_ids, indexes: INDEXES, limit: 100)
    query = Chewy::Search::Request.new(*indexes)
    query = query.filter(terms: {state: ['published']})

    query.query(
      terms_set: {
        tag_ids: {
          terms: tag_ids,
          minimum_should_match_script: {
            source: "params.num_terms"
          }
        }
      }
    )
  end

  def self.boost_collections(query)
    boost = case Rails.env
            when 'production'
              {
                production_collections: 10,
                production_records: 1
              }
            when 'staging'
              {
                staging_collections: 10,
                staging_records: 1
              }
            else
              {
                development_collections: 10,
                development_records: 1
              }
            end
    query.indices_boost(boost)
  end
end