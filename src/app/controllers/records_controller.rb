class RecordsController < ApplicationController
  before_action :set_record, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: %i[show index]
  skip_after_action :verify_authorized, only: [:index]

  decorates_assigned :record, :records

  def index
    @records = Record.includes(:user).where(state: %w[published flagged])
  end

  def create
    @record = current_user.records.build(record_params)
    byebug
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
    @record.state = 'deleted'
    return render json: '', status: :no_content if @record.save
    render json: @record.errors, status: :unauthorized
  end

  private

  def set_record
    @record = Record.find_by(id: params[:id])
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
        :date_from, :date_to,
        collection_ids: [],
        location: %i[
          address
        ]
      )
    end
  end

  def check_transition(state)
    case state
    when 'published'
      @record.mark_as_published
    when 'pending_review'
      @record.mark_as_pending_review
    when 'flagged'
      @record.mark_as_flagged
    when 'draft'
      @record.mark_as_draft
    when 'delete'
    @record.mark_as_deleted
    end
  end
end
