class TagGroupPolicy < ApplicationPolicy

  def index?
    user.present?
  end

  def show?
    user.present?
  end

  class Scope < Scope
    def resolve
      scope.limit(999)
    end
  end
end
