class CustomLayersController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  def index
    @layers = Layer.all
    @layermakers = User.layermakers

    if user_signed_in?
      @images = GeoreferencerImage.all
    else
      @images = GeoreferencerImage.unreferenced
    end
  end

  def show
    @layer = Layer.find(params[:id])
  end
end
