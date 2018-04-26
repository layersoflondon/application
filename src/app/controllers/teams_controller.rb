class TeamsController < ApplicationController
  before_action :set_team, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show]

  def index
    @teams = Team.all
  end

  def create
    @team = Team.new(team_params)
    @team.team_users << TeamUser.new(user: current_user, role: 'leader')
    authorize(@team)

    # TODO Change me for more readable and usable code :)
    if @team.save
      if params[:is_form]
        redirect_to request.referer
      else
        return @team
      end
    else
      if params[:is_form]
        # TODO redirect / render showing the error
      else
        render json: @team.errors, status: :unprocessable_entity
      end
    end
  end

  def show; end

  def update
    authorize(@team_user)
    return render json: '', status: :no_content unless @team
    update_params = team_params.to_h
    @team.assign_attributes(update_params)
    return @team if @team.save
    render json: @team.errors, status: :unprocessable_entity
  end

  def destroy
    authorize(@team_user)
    return render json: '', status: :no_content if @team.destroy
    render json: @team.errors, status: :unprocessable_entity
  end

  private

  def set_team
    @team = Team.find_by_id(params[:id])
    render json: '', status: :not_found unless @team
    @team_user = @team.team_users.find_by(user_id: current_user.id)
  end

  def team_params
    params.require(:team).permit(
      :name,
      :description,
      :is_form
    )
  end
end
