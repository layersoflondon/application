class RecordsController < ApplicationController
  before_action :set_record, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: %i[show index]
  skip_after_action :verify_authorized, only: [:index]

  def index
    # TODO: show records from the current user as well
    @records = Record.where(state: 'published', deleted: false)
  end

  def create
    @record = Record.new(record_params.merge(user: current_user))
    authorize(@record)
    return @record if @record.save
    render json: @record.errors, status: :unprocessable_entity
  end

  def show
    authorize(@record)
  end

  def update
    update_record_params = record_params.to_h
    check_transition(update_record_params[:state])
    @record.assign_attributes(update_record_params)
    authorize(@record)
    return @record if @record.save
    render json: @record.errors, status: :unprocessable_entity
  end

  def destroy
    authorize(@record)
    @record.deleted = true
    return render json: '', status: :no_content if @record.save
    render json: @record.errors, status: :unauthorized
  end

  private

  def set_record
    @record = Record.where(id: params[:id], deleted: false).first
    render json: '', status: :not_found unless @record
  end

  def record_params
    if request.patch?
      params.require(:record).permit(
        :state
      )
    else
      params.require(:record).permit(
        :title,
        :description,
        :state,
        :lat,
        :lng,
        :date,
        location: %i[
          address
        ]
      )
    end
  end

  def check_transition(state)
    case state
    when 'pending_review'
      @record.review
    when 'published'
      @record.publish
    when 'flagged'
      @record.flag
    when 'drafted'
      @record.draft
    end
  end
end
