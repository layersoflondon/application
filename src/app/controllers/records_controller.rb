class RecordsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @records = Record.all
  end

  def create
    @record = Record.new(record_params)
    return @record if @record.save
    render json: @record.errors, status: :unprocessable_entity
  end

  def show
    @record = Record.find_by_id(params[:id])
    render json: '', status: :not_found unless @record
  end

  def update
    @record = Record.find_by_id(params[:id])
    render json: '', status: :not_found unless @record
    update_record_params = record_params.to_h
    @record.assign_attributes(update_record_params)
    return @record if @record.save
    render json: @record.errors, status: :unprocessable_entity
  end

  def destroy
    @record = Record.find_by_id(params[:id])
    return render json: '', status: :not_found unless @record
    # @TODO: check user delete permissions
    # clear associations
    @record.collections = []
    @record.save
    return render json: '', status: :no_content if @record.destroy
    render json: @record.errors, status: :unauthorized
  end

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
