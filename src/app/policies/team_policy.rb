class TeamPolicy < ApplicationPolicy

  def create?
    user.present?
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
