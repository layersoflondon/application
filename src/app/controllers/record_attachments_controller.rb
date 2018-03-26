class RecordAttachmentsController < ApplicationController
  before_action :set_record_and_attachment, only: %i[update]
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show]

  def index
    record = Record.find_by_id(params[:record_id])
    render json: '', status: :not_found unless record
    @attachments = record.attachments
  end

  def create
    record = Record.find_by_id(params[:record_id])
    authorize(@record)
    @attachment = record.attachments.build(attachment_params)
    @attachment.file.attach(params[:file]) if params[:file]
    return @attachment if @attachment.save
    render json: @attachment.errors.full_messages, status: :unprocessable_entity
  end

  def show
    record = Record.find_by_id(params[:record_id])
    return render json: '', status: :not_found unless record
    @attachment = record.attachments.find_by_id(params[:id])
    render json: '', status: :not_found unless @attachment
  end

  def update
    # # @TODO: check whether 'type_attachment' is same as content_type and store the file/text
    # # based on the mime type. Use a function for the method re-use in update
    # content = params[:attachment][:content]
    # @attachment.content.attach(content) if content
    # update_record_params = attachment_params.to_h
    # @attachment.assign_attributes(update_record_params.except(content))
    # return @attachment if @attachment.save
    # render json: @attachment.errors, status: :unprocessable_entity
  end

  def destroy
    # # @TODO: check whether user can delete the record from the collection
    record = Record.find_by_id(params[:record_id])
    return render json: '', status: :not_found unless record
    @attachment = record.attachments.find_by_id(params[:id])
    render json: '', status: :not_found unless @attachment
    # remove the file from the file system
    @attachment.file.purge
    # delete the association
    record.attachments.delete(@attachment)
    # delete the record attachment
    @attachment.delete
  end

  private

  def attachment_params
    params.permit(:attachment_type,
                  attachable_attributes: %i[
                    title
                    caption
                    credit
                    url
                  ])
  end
end
