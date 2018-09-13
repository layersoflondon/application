class CollectionRecordPolicy < ApplicationPolicy
  # NB record here is a CollectionRecord instance.
  def create?
    collection_owned_by_user? || collection_owned_by_users_team? || collection_writable_by_everyone?
  end

  def destroy?
    collection_record_owned_by_user? && create?
  end

  def update?
    false
  end

  private

  def collection_record_owned_by_user?
    user.present? && record.contributing_user_id == user.id
  end

  def collection_owned_by_user?
    user.present? && record.collection.owner.is_a?(User) && record.collection.owner == user && record.collection.owner?
  end

  def collection_owned_by_users_team?
    user.present? && record.collection.owner.is_a?(Team) && record.collection.owner.users.include?(user) && record.collection.team?
  end

  def collection_writable_by_everyone?
    record.collection.everyone?
  end





end