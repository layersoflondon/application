class TeamPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def show?
    user.present?
  end

  def create?
    user.present?
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
