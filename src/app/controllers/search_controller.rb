class SearchController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: [:index]
  def index
    query_record_index = RecordsIndex
                         .query(
                           multi_match: {
                             'query': params[:q],
                             'type': 'most_fields',
                             'fields':      [
                               'title',
                               'description',
                               'location.address',
                               'attachments.title',
                               'attachments.caption',
                               'taxonomy_terms.taxonomy.description'
                             ]
                           }
                         )

    if params[:attachment_type].present?
      params[:attachment_type].each do |type|
        query_record_index = query_record_index.filter('term': { 'attachments.attachable_type': type })
      end
    end

    if params[:type].present?
      params[:type].each do |type|
        query_record_index = query_record_index.filter('term': { 'taxonomy_terms.name': type })
      end
    end

    if params[:theme].present?
      params[:theme].each do |theme|
        query_record_index = query_record_index.filter('term': { 'taxonomy_terms.name': theme })
      end
    end

    if params[:geobounding].present?
      top_left = params[:geobounding][:top_left]
      bottom_right = params[:geobounding][:bottom_right]
      top_left_lat = top_left[:lat]
      top_left_lng = top_left[:lng]
      bottom_right_lat = bottom_right[:lat]
      bottom_right_lng = bottom_right[:lng]
      query_record_index = query_record_index.filter('geo_bounding_box': {
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

    @records = query_record_index
  end
end
