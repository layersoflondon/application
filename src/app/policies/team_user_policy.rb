class TeamUserPolicy < ApplicationPolicy

  def show?
    user.present? && record.user_id == user.id && record.state == 'access_granted'
  end

  def create?
    user.present? && record.user_id == user.id && record.role == 'leader'
  end

  def update?
    user.present? && record.user_id == user.id && record.role == 'leader' && record.state == 'access_granted'
  end

  def destroy?
    update?
  end

  def invite_user?
    user.present? && record.role == 'leader' && record.state == 'access_granted'
  end

  def leave?
    show?
  end

  def accept_request?
    create?
  end

  def deny_request?
    create?
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
