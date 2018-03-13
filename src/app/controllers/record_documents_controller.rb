class RecordDocumentsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_record, only: %i[index create show update destroy]

  def index; end

  def create
    @record = Record.find_by_id(params[:record_id])
    render json: '', status: :not_found unless @record
    # TODO: check when no file is provided
    documents = params[:record][:documents]
    @record.documents.attach(documents) if documents
    @document = @record.documents.last
  end

  def show
    @document = @record.documents.find_by_id(params[:id])
    render json: '', status: :not_found unless @document
  end

  def destroy
    @document = @record.documents.find_by_id(params[:id])
    render json: '', status: :not_found unless @document
    @document.purge
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_record
    @record = Record.find_by_id(params[:record_id])
    render json: '', status: :not_found unless @record
  end
end
