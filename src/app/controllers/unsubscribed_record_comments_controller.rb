class UnsubscribedRecordCommentsController < ApplicationController

  decorates_assigned :record, with: RecordDecorator
  before_action :get_record

  layout 'templates/account'

  def unsubscribe!
    unless current_user.unsubscribed_records.include?(@record)
      current_user.unsubscribed_records << @record
    end
    redirect_to unsubscribed_record_comment_path(@record), success: "You've been unsubscribed"
  end

  def subscribe!
    current_user.unsubscribed_records -= [@record]
    redirect_to unsubscribed_record_comment_path(@record), success: "You've been subscribed"
  end

  def show
    
  end

  private

  def get_record
    @record = Record.find(params[:id])
    raise ActionController::RoutingError, "no record found" unless @record.present?
    authorize @record, :subscribe_to_comments?
  end
end
