class TeamPolicy < ApplicationPolicy

  def index?
    user.present?
  end

  def show?
    is_leader? || is_contributor?
  end

  def search?
    user.present?
  end

  def new?
    user.present?
  end

  def create?
    new?
  end

  def destroy?
    manage_members?
  end

  def manage_members?
    is_leader? && access_granted?
  end

  def invite_users?
    manage_members?
  end

  def view_members?
    show?
  end

  def leave?
    is_contributor?
  end

  def remove?
    manage_members?
  end

  def request_to_join?
    team_user = record.team_users.find_by(user_id: user.id)
    # record in this case it the team they want to join
    user.present? && (team_user.nil? || team_user.access_requested?)
  end

  def accept_invitation?
    user.present? && record.users.include?(user)
  end

  def accept_request?
    is_leader?
  end

  def deny_request?
    is_leader?
  end

  private
  def access_granted?
    user.present? && record.present? && record.team_users.find_by(user_id: user.id).try(:access_granted?)
  end

  def is_leader?
    user.present? && record.leaders.include?(user)
  end

  def is_contributor?
    user.present? && record.contributors.include?(user) && record.team_users.find_by(user_id: user.id).access_granted?
  end

  class Scope < Scope
    def resolve
      user.teams.includes(:team_users).references(:team_users)
    end
  end
end
