class CollectionsController < ApplicationController

  skip_before_action :verify_authenticity_token

  def index
    @collections = Collection.all
  end

  def show
    @collection = Collection.find(params[:id])
  end

  def create
    @collection = Collection.new(collection_params)
    if @collection.save
      return @collection
    end
    return render json: @collection.errors, status: :unprocessable_entity
  end

  def update
    @collection = Collection.find(params[:id])
    update_collection_params = collection_params.to_h
    @record.assign_attributes(update_collection_params)
    unless @collection.save
      return render json: @collection.errors, status: :unprocessable_entity
    end
  end

  def collection_params
    params.require(:collection).permit(
        :title,
        :description,
        :read_state,
        :write_state
    )
  end
end
