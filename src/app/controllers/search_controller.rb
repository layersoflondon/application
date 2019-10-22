class SearchController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: [:index]

  def index
    Rails.logger.info("\n\n#{params}\n\n")

    if params[:q].present? && !params[:geobounding].present?
      @results = MultiIndexSearch.query(params)
    elsif params[:geobounding].present? # also checks for params[:q]
      @results = MultiIndexSearch.filter_by_geobounds(params)
    elsif params[:date_range].present?
      @results = MultiIndexSearch.filter_by_date_range(params)
    elsif params[:user_id].present?
      @results = RecordsIndex.user_records(params)
    elsif params[:collections].present? && params[:collections].in?(["true", true])
      args = Rails.env.development? ? {limit: 2} : {} # todo: remove to test with full collections list 
      @results = CollectionsIndex.published(**args)
    elsif params[:type].present? && params[:type].in?(['highlighted', 'popular'])
      args = params.permit!.to_hash.without(:type)
      @results = MultiIndexSearch.send(params[:type], args)
    elsif params[:tag_ids].present?
      @results = MultiIndexSearch.query({q: ""})
    else
      render json: '', status: :bad_request
    end
  end
end
