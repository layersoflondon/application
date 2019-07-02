class CollectionPolicy < ApplicationPolicy
  def show?
    record.read_state == "public_read" || (user.present? && user.can_view(record))
  end

  def create?
    record.owner_type == 'User' || user_belongs_team?
  end


  def update?
    is_user_owner_of_collection? || user_belongs_team?
  end

  def edit?
    update?
  end

  def destroy?
    is_user_owner_of_collection? || is_user_team_leader_of_collection?
  end

  def add_to?
    update? || user_belongs_team? || record.write_state == "everyone"
  end

  private

  def is_user_owner_of_collection?
    record.owner_type == 'User' && record.owner_id == user.id
  end

  def is_user_team_leader_of_collection?
    record.owner_type == 'Team' && user.team_users.where(team_id: record.owner_id).count.positive?
  end

  def user_belongs_team?
    record.owner_type == 'Team' && user.team_users.where(team_id: record.owner_id).count.positive?
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
