class LayersController < ApplicationController
  # before_action :set_layer, only: %i[show]
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show search]

  def index
    @layer_groups = LayerGroupsIndex.all.limit(999)
  end

  def show
    slug = "#{params[:id]}"
    @layer_group = LayerGroupsIndex.query{match(slug: slug)}.first
  end

  def search
    @layer_groups = LayerGroup.where("title like :query", {query: "%#{params[:query]}%"})
                  .or(LayerGroup.where("description like :query", {query: "%#{params[:query]}%"}))
  end

  private

  def set_layer
    @layer_group = LayerGroup.find_by_id(params[:id])
    render json: '', status: :not_found unless @layer_group
  end
end
