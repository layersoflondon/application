class UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[show]
  skip_after_action :verify_authorized, only: [:show]
  decorates_assigned :user, with: UserDecorator
  decorates_assigned :records, with: RecordDecorator
  def show
    @user = User.find(params[:id])
    @records = RecordsIndex.user_records(
      user_id: @user.id,
      record_states: (current_user.try(:id) == @user.id.to_i) ? ['published', 'draft'] : ['published']
    )
  end
end
