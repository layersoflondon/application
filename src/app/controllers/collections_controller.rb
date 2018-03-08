class CollectionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @collections = Collection.all
  end

  def create
    @collection = Collection.new(collection_params)
    return @collection if @collection.save
    render json: @collection.errors, status: :unprocessable_entity
  end

  def show
    @collection = Collection.find_by_id(params[:id])
    render json: '', status: :not_found unless @collection
  end

  def update
    @collection = Collection.find_by_id(params[:id])
    render json: '', status: :not_found unless @collection
    update_collection_params = collection_params.to_h
    @collection.assign_attributes(update_collection_params)
    return @collection if @collection.save
    render json: @collection.errors, status: :unprocessable_entity
  end

  def destroy
    @collection = Collection.find_by_id(params[:id])
    return render json: '', status: :not_found unless @collection
    #   # @TODO: check user delete permissions
    return render json: '', status: :no_content if @collection.destroy
    render json: @collection.errors, status: :unauthorized
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
