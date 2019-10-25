class TagGroupPolicy < ApplicationPolicy

  def index?
    true
  end

  def show?
    true
  end

  class Scope < Scope
    def resolve
      scope.limit(999)
    end
  end
end
