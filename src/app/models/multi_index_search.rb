class MultiIndexSearch
  INDEXES = [
    RecordsIndex,
    CollectionsIndex
  ]

  def self.filter_by_geobounds(search_params, indexes: INDEXES, limit: 100)
    es_query = Chewy::Search::Request.new(*indexes).query(
      match_all: {

      }

    )

    if search_params[:geobounding].present?
      es_query = add_geobounding_filter(search_params[:geobounding], es_query)
    end

    es_query = filter_by_state(es_query)
    es_query = es_query.limit(limit)
  end

  def self.query(search_params, indexes: INDEXES, limit: 100)
    multi_match_fields = %w[title description location attachments.title attachments.caption taxonomy_terms.taxonomy.description]


    es_query = Chewy::Search::Request.new(*indexes).query(
      multi_match: {
        'query': search_params[:q],
        'type': 'most_fields',
        'fields': multi_match_fields
      },

    )
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

  def self.filter_by_state(query, state: 'published')
    query.filter(term: {state: state})
  end
end