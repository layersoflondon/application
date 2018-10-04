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

  def switch_role
    authorize(current_user)
    role = current_user.role == 'teacher' ? nil : :teacher
    current_user.update_attribute(:role, role)

    return render json: {role: current_user.role}
  end

  def generate_token
    authorize(current_user)

    return render json: {teacher_token: current_user.generate_token, teacher_token_expires: DateTime.now+10.days}
  end
end
