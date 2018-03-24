class TeamsController < ApplicationController
  def index
    @teams = Team.all
  end

  def create
    @team = Team.new(team_params)
    return @team if @team.save
    render json: @team.errors, status: :unprocessable_entity
  end

  def show
    @team = Team.find_by_id(params[:id])
    render json: nil, status: :no_content unless @team
  end

  def update
    @team = Team.find_by_id(params[:id])
    return render json: '', status: :no_content unless @team
    update_params = team_params.to_h
    @team.assign_attributes(update_params)
    return @team if @team.save
    render json: @team.errors, status: :unprocessable_entity
  end

  def destroy
    @team = Team.find_by_id(params[:id])
    return render json: '', status: :no_content unless @team
    # @TODO: check user delete permissions
    return render json: '', status: :no_content if @team.destroy
    render json: @team.errors, status: :unauthorized
  end

  def team_params
    params.require(:team).permit(
      :name,
      :description
    )
  end
end
