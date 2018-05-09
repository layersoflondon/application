class TeamsController < ApplicationController
  before_action :set_team, only: %i[show update destroy invite_user leave accept_request deny_request]
  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :verify_authorized, only: [:index]

  def index
    @teams = Team.all
  end

  def create
    @team = Team.new(team_params)
    authorize(@team)
    created = current_user.create_team(@team)
    respond_to do |format|
      format.html {
        if created
          redirect_to request.referer
        else
          # TODO: redirect / render showing the error
        end
      }
      format.json {
        if created
          return @team
        else
          render json: @team.errors, status: :unprocessable_entity
        end
      }
    end
  end

  def show
    authorize(@team_user)
  end

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
    destroyed = @team.destroy

    respond_to do |format|
      format.html {
        if destroyed
          redirect_to :controller => 'user_teams', :action => 'index'
        else
          redirect_to request.referer
        end
      }
      format.json {
        if destroyed
          render json: '', status: :no_content
        else
          render json: @team.errors, status: :unprocessable_entity
        end
      }
    end
  end

  def request_to_join_team
    authorize(current_user)
    @team = Team.find_by_name(params[:query])
    if @team
      current_user.request_join_team @team
    end
    redirect_to request.referer
  end

  def invite_user
    authorize(@team_user)
    query = params[:query]
    emails = query.split(',')
    users = User.where(email: emails)
    users.each do |user|
      @team.invite(current_user, user)
    end
    redirect_to :controller => 'teams', :action => 'show', :format => 'html'
  end

  def accept_invitation
    authorize(current_user)
    @team = Team.find_by_id(params[:id])
    @accepted = current_user.accept_team_invitation(@team, params[:key])
  end

  def leave
    authorize(@team_user)
    redirect_to :controller => 'user_teams', :action => 'index' if @team_user.destroy
  end

  def accept_request
    authorize(@team_user)
    @accepted = current_user.accept_team_request(@team, params[:key])
  end

  def deny_request
    authorize(@team_user)
    @denied = current_user.deny_team_request(@team, params[:key])
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
      :is_form,
      :query
    )
  end
end
