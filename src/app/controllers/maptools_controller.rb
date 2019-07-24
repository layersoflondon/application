class MaptoolsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show state]
  skip_after_action :verify_authorized, only: %i[index show state]

  layout 'maptools'

  def index
  end

  def show
  end

  def create
    Rails.logger.info(params)
  end
end
