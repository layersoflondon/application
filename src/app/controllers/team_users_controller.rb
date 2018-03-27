class TeamUsersController < ApplicationController
  before_action :set_team, only: %i[index create show update destroy]
  before_action :set_team_user, only: %i[create destroy]
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show]

  def index
    @users = @team.users
  end

  def create
    team_user = @team.team_users.find_by(user_id: current_user.id)
    authorize(team_user)
    @team.users << @user unless @team.users.exists?(@user.id)
  end

  def destroy
    team_user = @team.team_users.find_by(user_id: current_user.id)
    authorize(team_user)
    @team.users.delete(@user)
  end

  def set_team
    @team = Team.find_by_id(params[:team_id])
    render json: '', status: :not_found unless @team
  end

  def set_team_user
    @user = User.find_by_id(params[:id])
    render json: '', status: :not_found unless @user
  end
end
