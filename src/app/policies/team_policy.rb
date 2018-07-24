class TeamPolicy < ApplicationPolicy

  def show?
    is_leader? || is_contributor?
  end

  def search?
    true
  end

  def create?
    is_leader? && access_granted?
  end

  def delete?
    create?
  end

  def manage_members?
    create?
  end

  def view_members?
    show?
  end

  def leave?
    is_contributor?
  end

  private
  def access_granted?
    user.present? && record.present? && record.team_users.find_by(user_id: user.id).try(:access_granted?)
  end

  def is_leader?
    user.present? && record.leaders.include?(user)
  end

  def is_contributor?
    user.present? && record.contributors.include?(user)
  end

  class Scope < Scope
    def resolve

    end
  end
end
