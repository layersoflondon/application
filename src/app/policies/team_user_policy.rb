class TeamUserPolicy < ApplicationPolicy

  def update?
    user.present? && record.user_id == user.id && record.role == 'leader'
  end

  def destroy?
    update?
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
