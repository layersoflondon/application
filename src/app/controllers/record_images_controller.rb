class RecordImagesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_record, only: %i[index create show update destroy]

  def index; end

  def create
    @record = Record.find_by_id(params[:record_id])
    render json: '', status: :not_found unless @record
    # TODO: check when no file is provided
    images = params[:record][:images]
    @record.images.attach(images) if images
    @image = @record.images.last
  end

  def show
    @image = @record.images.find_by_id(params[:id])
    render json: '', status: :not_found unless @image
  end

  def destroy
    @image = @record.images.find_by_id(params[:id])
    render json: '', status: :not_found unless @image
    @image.purge
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_record
    @record = Record.find_by_id(params[:record_id])
    render json: '', status: :not_found unless @record
  end
end
