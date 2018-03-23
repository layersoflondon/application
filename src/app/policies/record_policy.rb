class RecordPolicy < ApplicationPolicy

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

  # TODO record editors should be able to update
  def update?
    create?
  end

  # TODO should record editors be able to destroy? don't know.
  def destroy?
    create?
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
