class UserController < ApplicationController
  layout 'iframe', only: [:record_collections, :teams]

  def record_collections
    authorize(current_user)
  end

  def teams
    authorize(current_user)

    team_user_access_requested = TeamUser.where(user_id: current_user.id, state: 'access_requested')
    @leader_teams = current_user.leading_teams
    @contributor_teams = current_user.contributing_teams
    @access_requested = Team.where(id: team_user_access_requested.collect{|t| t.team_id})
    @team = Team.new
  end
end
