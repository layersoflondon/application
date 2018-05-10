class CollectionsController < ApplicationController
  before_action :set_collection, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index]

  decorates_assigned :collection, :collections

  def index
    @collections = if user_signed_in?
                     current_user.collections
                   else
                     Collection.includes(:owner, :records).where(read_state: 'public_read')
                   end
  end

  def create
    @collection = current_user.collections.build(collection_params)
    authorize(@collection)
    return @collection if @collection.save
    render json: @collection.errors, status: :unprocessable_entity
  end

  def show
    authorize(@collection)
  end

  def update
    @collection = Collection.find_by_id(params[:id])
    authorize(@collection)
    render json: '', status: :not_found unless @collection
    update_collection_params = collection_params.to_h
    @collection.assign_attributes(update_collection_params)
    return @collection if @collection.save
    render json: @collection.errors, status: :unprocessable_entity
  end

  def destroy
    @collection = Collection.find_by_id(params[:id])
    authorize(@collection)
    return render json: '', status: :not_found unless @collection
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
      :write_state,
      :write_state_team_id,
      :owner_id,
      :owner_type
    )
  end
end
