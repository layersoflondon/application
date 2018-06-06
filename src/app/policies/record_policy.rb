class RecordPolicy < ApplicationPolicy
  def index?
    if record.published?
      true
    else
      user.present? && record.user_id == user.id
    end
  end

  def show?
    if record.published? || record.flagged?
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
    create?
  end

  def like?
    !user.record_likes.include?(record.id)
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
