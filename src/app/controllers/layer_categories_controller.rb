class LayerCategoriesController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: %i[index]
  
  def index
    @layer_categories = LayerCategoriesIndex.all
  end
end