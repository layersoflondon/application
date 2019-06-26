class CommentPolicy < ApplicationPolicy
  class Scope < Scope
    def index?
      true
    end

    def create?
      user.present?
    end

    def update?
      record.user === user
    end

    def destroy?
      record.user === user
    end

    def resolve
      scope.all
    end
  end
end
