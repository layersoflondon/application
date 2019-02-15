class CustomLayersController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  def index
    @layers = []
    @contributors = Georeferencer::Contributor.all!

    if user_signed_in?
      @images = Georeferencer::Image.all
    else
      @images = Georeferencer::Image.unreferenced
    end
  end

  def show
    # @images = GeoreferencerImage.where(params....)
    @images = Georeferencer::Image.all!.sample(10)
    @markers = @images.collect do |image|
      {popup: image.title, latlng: image.centroid.values}
    end

    @progress = Georeferencer::Progress.find(params[:id])

    @centre_marker = (@markers[@markers.length/2])||@markers.first
    @centre = @centre_marker.try(:[], :latlng)
  end
end
