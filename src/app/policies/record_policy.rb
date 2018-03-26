class RecordPolicy < ApplicationPolicy
  def index?
    if record.published?
      true
    else
      user.present? && record.user_id == user.id
    end
  end

  def show?
    if record.published?
      true
    else
      user.present? && record.user_id == user.id
    end
  end

  def create?
    user.present? && record.user_id == user.id
  end

  def update?
    create?
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
