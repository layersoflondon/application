class UserPolicy < ApplicationPolicy

  def index?
    user.present? && record.id == user.id
  end

  def teams?
    user.present?
  end

  def accept_invitation?
    user.present?
  end

  def record_collections?
    user.present?
  end

  def request_to_join_team?
    user.present?
  end

  def switch_role?
    user.present?
  end

  def generate_token?
    user.present?
  end

  def classroom_login?
    true
  end

  def invalidate_current_token?
    user.present?
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
