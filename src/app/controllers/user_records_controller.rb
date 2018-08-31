class UserRecordsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[show]
  skip_after_action :verify_authorized, only: [:show]
  decorates_assigned :user, with: UserDecorator
  decorates_assigned :records, with: RecordDecorator
  def show
    @records = RecordsIndex.user_records(
      user_id: params[:id],
      record_states: (current_user.try(:id) == params[:id].to_i) ? ['published', 'draft'] : ['published']
    )
    if @records.count > 0
      @user = OpenStruct.new(@records.first.user)
    else
      raise ActionController::RoutingError, "No user found, or no records for user"
    end
  end
end
