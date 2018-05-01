class TeamUserPolicy < ApplicationPolicy

  def show?
    user.present? && record.user_id == user.id && record.state == 'access_granted'
  end

  def create?
    user.present? && record.user_id == user.id && record.role == 'leader'
  end

  def update?
    create?
  end

  def destroy?
    user.present? && record.user_id == user.id
  end

  def invite_member?
    user.present? && record.role == 'leader'
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
