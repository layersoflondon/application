class RecordsController < ApplicationController
  before_action :set_record, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: [:show, :index]
  skip_after_action :verify_authorized, only: [:show, :index]

  def index
    @records = Record.all
  end

  def create
    @record = Record.new(record_params.merge(user: current_user))
    authorize(@record) #passes @record and current_user into the RecordPolicy and calls .create?() on it
    return @record if @record.save
    render json: @record.errors, status: :unprocessable_entity
  end

  def show
    authorize(@record)
  end

  def update
    update_record_params = record_params.to_h
    @record.assign_attributes(update_record_params)
    authorize(@record)
    return @record if @record.save
    render json: @record.errors, status: :unprocessable_entity
  end

  def destroy
    # @TODO: check user delete permissions
    # @TODO: check when record has associated collections, Error:
    # Mysql2::Error: Cannot delete or update a parent row: a foreign key constraint fails ...
    authorize(@record)
    return render json: '', status: :no_content if @record.destroy
    render json: @record.errors, status: :unauthorized
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_record
    @record = Record.find_by_id(params[:id])
    render json: '', status: :not_found unless @record
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def record_params
    params.require(:record).permit(
      :title,
      :description,
      :state,
      :lat,
      :lng,
      :date
    )
  end
end
