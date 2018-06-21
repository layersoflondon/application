class SearchController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: [:index]

  def index
    # TODO we need to query collections and records, and union the 2, sorting by score (at least for now, we might be able to get ES to do better than that)
    if params[:q].present?
      @records = Record.custom_search(params)
    elsif params[:geobounding].present?
      @records = Record.filter_by_geobounds(params)
    else
      render json: '', status: :bad_request
    end
  end
end
