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
      @results = CollectionsIndex.published
    elsif params[:tag_ids].present?
      tag_ids = [params[:tag_ids]]
      @results = RecordsIndex.published.with_tags(tag_ids)
    elsif params[:tag_group_ids].present?
      tag_group_ids = [params[:tag_group_ids]]
      @results = RecordsIndex.published.with_tag_groups(tag_group_ids)
    else
      render json: '', status: :bad_request
    end
  end
end
