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
      # scope.query(nested: {path: "tags", query: {bool: {must: [range: {"tags.record_count" => {gt: 0}}]}}}).to_a
    end
  end
end
