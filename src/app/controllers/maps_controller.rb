class MapsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show]

  layout 'map'

  def index
  end

  def show
  end
end
