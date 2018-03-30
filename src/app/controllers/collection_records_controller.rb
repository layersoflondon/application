class CollectionRecordsController < ApplicationController
  before_action :set_collection, only: %i[index create destroy]
  before_action :set_collection_record, only: %i[create destroy]
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: [:index]
  def index; end

  def create
    authorize(@collection)
    @collection.records << @record unless @collection.records.exists?(@record.id)
  end

  def destroy
    authorize(@collection)
    @collection.records.delete(@record)
  end

  private

  def set_collection
    @collection = Collection.find_by_id(params[:collection_id])
    render json: '', status: :not_found unless @collection
  end

  def set_collection_record
    @record = Record.find_by_id(params[:id])
    render json: '', status: :not_found unless @record
  end
end
