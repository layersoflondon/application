class CollectionsController < ApplicationController
  before_action :set_collection, only: %i[show update destroy]
  skip_before_action :verify_authenticity_token

  def index
    @collections = Collection.all
  end

  def create
    @collection = Collection.new(collection_params)
    return @collection if @collection.save
    render json: @collection.errors, status: :unprocessable_entity
  end

  def show; end

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
    # @TODO: check user delete permissions
    # @TODO: check when collections has associated records, Error:
    # Mysql2::Error: Cannot delete or update a parent row: a foreign key constraint fails ...
    return render json: '', status: :no_content if @collection.destroy
    render json: @collection.errors, status: :unauthorized
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_collection
    @collection = Collection.find_by_id(params[:id])
    render json: '', status: :not_found unless @collection
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def collection_params
    params.require(:collection).permit(
      :title,
      :description,
      :read_state,
      :write_state
    )
  end
end
