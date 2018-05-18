class RecordAttachmentsController < ApplicationController
  before_action :set_record, only: %i[index create show update destroy]
  before_action :set_record_attachment, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show]

  def index
    @attachments = @record.attachments
  end

  def create
    authorize(@record)
    @attachment = @record.attachments.build(attachment_params)
    return @attachment if @attachment.save
    render json: @attachment.errors.full_messages, status: :unprocessable_entity
  end

  def show; end

  def update
    authorize(@record)

    @attachment = @record.attachments.find(params[:id])
    unless @attachment.attachable.update_attributes(attachment_params[:attachable_attributes])
      render json: @attachment.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    authorize(@record)
    # remove the file from the file system
    @attachment.file.purge if @attachment.file
    # delete the association
    @record.attachments.delete(@attachment)
    # delete the record attachment
    @attachment.delete
  end

  private

  def set_record
    @record = Record.find_by_id(params[:record_id])
    render json: '', status: :not_found unless @record
  end

  def set_record_attachment
    @attachment = @record.attachments.find_by_id(params[:id])
    render json: '', status: :not_found unless @attachment
  end

  def attachment_params
    params.permit(:attachment_type,
                  :record_id,
                  :record_attachment,
                  attachable_attributes: %i[
                    title
                    caption
                    credit
                    url
                    youtube_id
                    primary
                    file
                  ])
  end
end
