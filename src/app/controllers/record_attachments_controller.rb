class RecordAttachmentsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_record_and_attachment, only: %i[update show destroy]

  def index
    record = Record.find_by_id(params[:record_id])
    render json: '', status: :not_found unless record
    @attachments = []
    record.file_attachments.each { |file| @attachments << build_attachment(file, false) }
  end

  def create
    record = Record.find_by_id(params[:record_id])

    @attachment = record.attachments.build(attachment_params)
    return @attachment if @attachment.save
    render json: @attachment.errors.full_messages, status: :unprocessable_entity

  end

  def show; end

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
    # # remove the file from the file system
    # @attachment.content.purge
    # # delete the association
    # @record.attachments.delete(@attachment)
    # # delete the record attachment
    # @attachment.delete
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_record_and_attachment
    # @attachment = Attachment.find_by_id(params[:id])
    # return render json: '', status: :not_found unless @attachment
    # @record = @attachment.records.find_by_id(params[:record_id])
    # return render json: '', status: :not_found unless @record
    # render json: '', status: :bad_request if @record.id.to_s != params[:record_id]
  end

  def attachment_params
    params.permit( :attachment_type,
                   attachable_attributes: [
                     :title,
                     :caption,
                     :credit,
                     :file
                   ]
    )
  end

  def build_attachment(file_attachment, data_attachment)
    if file_attachment
      {
        id: file_attachment.id,
        content_type: file_attachment.file.blob.content_type,
        byte_size: file_attachment.file.blob.byte_size,
        url: url_for(file_attachment.file)
      }
    else # when data_attachment
      {
        id: data_attachment.id,
        content_type: 'data',
        byte_size: '',
        url: nil
      }
    end
  end
end
