class TagGroupPolicy < ApplicationPolicy

  def index?
    user.present?
  end

  def show?
    user.present?
  end

  class Scope < Scope
    def resolve
      # TagGroupsIndex.all.order(created_at: :desc)
      scope.all
    end
  end
end
