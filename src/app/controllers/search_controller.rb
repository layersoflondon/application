class SearchController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: [:index]

  def index
    if params[:q].present?
      @records = Record.custom_search(params)
    else
      render json: '', status: :bad_request
    end
  end
end
