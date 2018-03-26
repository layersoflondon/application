class TeamUserPolicy < ApplicationPolicy

  def create?
    user.present? && record.user_id == user.id && record.role == 'leader'
  end

  def update?
    create?
  end

  def destroy?
    create?
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
