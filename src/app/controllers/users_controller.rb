class UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [:show, :classroom, :classroom_login]
  skip_after_action :verify_authorized, only: [:show, :classroom, :classroom_login]
  decorates_assigned :user, :teacher, with: UserDecorator
  decorates_assigned :records, with: RecordDecorator
  def show
    @user = User.find(params[:id])
    @records = RecordsIndex.user_records(
      user_id: @user.id,
      record_states: (current_user.try(:id) == @user.id.to_i) ? ['published', 'draft'] : ['published']
    )
  end

  def classroom
    @teacher = User.where('teacher_token_expires > ?', DateTime.now).find_by(role: :teacher, teacher_token: params[:id])

    redirect_to root_path unless @teacher
  end

  def classroom_login
    @teacher = User.find_by(role: :teacher, teacher_token: params[:id])

    redirect_to root_path, notice: "Sorry, we couldn't log you in" unless @teacher

    sign_in @teacher
    session[:teacher_classroom_user] = params[:name]

    redirect_to root_path
  end

  def switch_role
    authorize(current_user)
    role = current_user.role == 'teacher' ? nil : :teacher
    current_user.update_attribute(:role, role)

    render json: {role: current_user.role}
  end

  def generate_token
    authorize(current_user)

    expiry_date = DateTime.parse(params[:expiry])
    current_user.generate_token_with_expiry_date!(expiry_date)

    render json: {teacher_token: current_user.teacher_token, teacher_token_expires: current_user.teacher_token_expires}
  end

  def invalidate_current_token
    authorize(current_user)

    current_user.update_attributes({teacher_token: nil, teacher_token_expires: nil})

    render json: {teacher_token: nil, teacher_token_expires: nil}
  end
end
