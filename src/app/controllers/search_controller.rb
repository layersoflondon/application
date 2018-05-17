class SearchController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: [:index]
  def index
    query_record_index = RecordsIndex
               .query(
                 multi_match: {
                   "query": params[:q],
                   "type": 'most_fields',
                   "fields":      [
                     'title',
                     'description',
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

    @records = query_record_index
  end
end
