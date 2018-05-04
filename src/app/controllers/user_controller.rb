class UserController < ApplicationController
  layout 'iframe', only: [:record_collections, :teams]

  def record_collections
    authorize(current_user)
  end

  def teams
    authorize(current_user)
    team_user_leader = TeamUser.where(user_id: current_user.id, role: 'leader', state: 'access_granted')
    team_user_contributor = TeamUser.where(user_id: current_user.id, role: 'contributor', state: 'access_granted')
    team_user_access_requested = TeamUser.where(user_id: current_user.id, state: 'access_requested')
    @leader_teams = Team.where(id: team_user_leader.collect{|t| t.team_id})
    @contributor_teams = Team.where(id: team_user_contributor.collect{|t| t.team_id})
    @access_requested = Team.where(id: team_user_access_requested.collect{|t| t.team_id})
    @team = Team.new
  end
end
