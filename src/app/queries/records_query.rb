module RecordsQuery
  extend ActiveSupport::Concern

  class_methods do
    def custom_search(search_params)
      multi_match_fields = %w[title description location attachments.title attachments.caption taxonomy_terms.taxonomy.description]


      es_query = RecordsIndex.query(
          multi_match: {
              'query': search_params[:q],
              'type': 'most_fields',
              'fields': multi_match_fields
          }
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

      if search_params[:geobounding].present?
        top_left = search_params[:geobounding][:top_left]
        bottom_right = search_params[:geobounding][:bottom_right]
        top_left_lat = top_left[:lat]
        top_left_lng = top_left[:lng]
        bottom_right_lat = bottom_right[:lat]
        bottom_right_lng = bottom_right[:lng]
        es_query = es_query.filter('geo_bounding_box': {
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
  end
end