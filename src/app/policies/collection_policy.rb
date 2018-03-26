class CollectionPolicy < ApplicationPolicy

  def show?
    if record.public_read?
      true
    else
      record.present? # TODO: check owner
    end
  end

  def create?
    record.present? # TODO: check owner
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
