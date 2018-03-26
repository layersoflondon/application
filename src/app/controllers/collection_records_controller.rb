class CollectionRecordsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: [:index]
  def index
    @collection = Collection.find_by_id(params[:collection_id])
    render json: '', status: :not_found unless @collection
  end

  def create
    @collection = Collection.find_by_id(params[:collection_id])
    authorize(@collection)
    @record = Record.find_by_id(params[:id])
    return render json: '', status: :not_found unless @record
    # @TODO: check whether user can associate record to collection or not
    @collection.records << @record unless @collection.records.exists?(@record.id)
  end

  def destroy
    @collection = Collection.includes(:records).find(params[:collection_id])
    @record = Record.find_by_id(params[:id])
    return render json: '', status: :not_found unless @record
    # @TODO: check whether user can delete the record from the collection
    @collection.records.delete(@record)
  end
end
