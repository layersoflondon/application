class LayersController < ApplicationController
  before_action :set_layer, only: %i[show]
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show search]

  def index
    @layers = LayersIndex.all.order(:date_from).limit(999)
  end

  def show
  end

  def search
    @layers = Layer.where("title like :query", {query: "%#{params[:query]}%"})
                  .or(Layer.where("description like :query", {query: "%#{params[:query]}%"}))
  end

  private

  def set_layer
    @layer = Layer.find_by_id(params[:id])
    render json: '', status: :not_found unless @layer
  end
end
