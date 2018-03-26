class TeamsController < ApplicationController
  before_action :set_team, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: %i[show index]
  skip_after_action :verify_authorized, only: [:index]

  def index
    @teams = Team.all
  end

  def create
    @team = Team.new(team_params)
    authorize(@team)
    if @team.save
      @team.users << current_user
      return @team
    end
    render json: @team.errors, status: :unprocessable_entity
  end

  def show
    authorize(@team)
  end

  def update
    @team = Team.find_by_id(params[:id])
    authorize(@team)
    return render json: '', status: :no_content unless @team
    update_params = team_params.to_h
    @team.assign_attributes(update_params)
    return @team if @team.save
    render json: @team.errors, status: :unprocessable_entity
  end

  def destroy
    @team = Team.find_by_id(params[:id])
    authorize(@team)
    return render json: '', status: :no_content unless @team
    # @TODO: check user delete permissions
    return render json: '', status: :no_content if @team.destroy
    render json: @team.errors, status: :unauthorized
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_team
    @team = Team.find_by_id(params[:id])
    render json: '', status: :not_found unless @team
  end

  def team_params
    params.require(:team).permit(
      :name,
      :description
    )
  end
end
