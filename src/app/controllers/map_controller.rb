class MapController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show]
  def index
  end

  def show
    @cards = Record.limit(2)
  end
end
