class UserController < ApplicationController
  layout 'iframe', only: [:record_collections, :teams]
  decorates_assigned :records, with: RecordDecorator

  def record_collections
    authorize(current_user)

    @records = RecordsIndex.user_records(
      {user_id: current_user.id},
      record_states: (current_user.try(:id) == current_user.id.to_i) ? ['published', 'draft', 'pending_review'] : ['published']
    )

    @records = @records.query(match: {student_details: session['teacher_classroom_user']}) if session['teacher_classroom_user'].present?
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
