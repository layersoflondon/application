class SearchController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: [:index]

  def index
    # if Rails.env.development?
    #   @results = []
    #   render and return
    # end

    if params[:q].present? && !params[:geobounding].present?
      @results = MultiIndexSearch.query(params)
    elsif params[:geobounding].present? # also checks for params[:q]
      @results = MultiIndexSearch.filter_by_geobounds(params)
    elsif params[:date_range].present?
      @results = MultiIndexSearch.filter_by_date_range(params)
    elsif params[:user_id].present?
      @results = RecordsIndex.user_records(params)
    elsif params[:collections].present? && params[:collections].in?(["true", true])
      @results = CollectionsIndex.published
    elsif params[:type].present? && params[:type] === 'highlighted'
      args = type_search_params.to_hash.without('type').with_indifferent_access
      @results = MultiIndexSearch.highlighted(args)
    elsif params[:type].present? && params[:type] === 'popular'
      args = type_search_params.to_hash.without('type').with_indifferent_access
      @results = MultiIndexSearch.popular(args)
    elsif params[:tag_ids].present?
      tag_ids = params[:tag_ids].split(',').map(&:to_i)
      @results = MultiIndexSearch.tagged(tag_ids)
    elsif params[:tag_group_ids].present?
      tag_group_ids = params[:tag_group_ids].split(',').map(&:to_i)
      @results = MultiIndexSearch.tag_grouped(tag_group_ids)
    else
      render json: '', status: :bad_request
    end
  end

  private
  def type_search_params
    params.require(:search).permit!
  end
end
