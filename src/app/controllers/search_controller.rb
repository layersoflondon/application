class SearchController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: [:index]

  def index
    if params[:q].present? && !params[:geobounding].present?
      Rails.logger.info("\n\nquery\n\n")
      @results = MultiIndexSearch.query(params)
    elsif params[:geobounding].present?
      Rails.logger.info("\n\ngeo query\n\n")
      @results = MultiIndexSearch.filter_by_geobounds(params)
    else
      render json: '', status: :bad_request
    end
  end
end
