class AttachmentsController < ApplicationController
  skip_before_action :verify_authenticity_token
  def index
    @attachments = Attachment.all
  end

  def create
    @attachment = Attachment.new(attachment_params)
    return @attachment if @attachment.save
    render json: @attachment.errors, status: :unprocessable_entity
  end

  def show
    @attachment = Attachment.find_by_id(params[:id])
    render json: nil, status: :no_content unless @attachment
  end

  def destroy
    @attachment = Attachment.find_by_id(params[:id])
    return render json: '', status: :no_content unless @attachment
    # @TODO: check user delete permissions
    return render json: '', status: :no_content if @attachment.destroy
    render json: @attachment.errors, status: :unauthorized
  end

  def attachment_params
    params.require(:attachment).permit(
        :attachment_type,
        :state,
        :attachment_data,
        :mime_type,
        :file_size
    )
  end
end
