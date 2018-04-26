class UserTeamsController < ApplicationController
  layout 'iframe', only: [:index]

  before_action :set_team_user, only: %i[create destroy]
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show]

  def index
    @teams = current_user.teams
    @team = Team.new
  end
end
