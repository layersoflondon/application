class CustomLayersController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  def index
    @layers = []
    @layermakers = User.layermakers

    if user_signed_in?
      @images = GeoreferencerImage.all
    else
      @images = GeoreferencerImage.unreferenced
    end
  end

  def show
    @images = GeoreferencerImage.all
    @markers = @images.collect do |image|
      {popup: image.title, latlng: image.centroid.values}
    end

    @centre_marker = (@markers[@markers.length/2])||@markers.first
    @centre = @centre_marker.try(:[], :latlng)

    Rails.logger.info(@markers)
  end
end
