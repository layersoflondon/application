class UserPolicy < ApplicationPolicy

  def record_collections?
    user.present?
  end

  def request_to_join_team?
    user.present?
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
