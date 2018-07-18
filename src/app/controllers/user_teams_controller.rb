class UserTeamsController < ApplicationController
  before_action :set_user, only: %i[index]

  def index
    authorize(@user)
    @teams = @user.teams
  end

  private

  def set_user
    @user = User.find_by_id(params[:id])
    render json: '', status: :not_found unless @user
  end
end
