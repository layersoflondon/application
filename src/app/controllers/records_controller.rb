class RecordsController < ApplicationController

  skip_before_action :verify_authenticity_token

  def index
    @records = Record.all
  end

  def create
    @record = Record.new(record_params)

    unless @record.save
      render json: @record.errors, status: :unprocessable_entity
    end
  end

  def show
    @record = Record.find(params[:id])
  end

  def update
    @record = Record.find(params[:id])
    update_record_params = record_params.to_h
    @record.assign_attributes(update_record_params)
    unless @record.save
      return render json: @record.errors, status: :unprocessable_entity
    end
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
