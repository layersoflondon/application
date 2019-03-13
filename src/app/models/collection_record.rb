class CollectionRecord < ApplicationRecord
  belongs_to :collection
  belongs_to :record

  belongs_to :contributing_user, class_name: "User"

  validates_presence_of :contributing_user_id
  validates_uniqueness_of :collection, scope: :record

  after_destroy if: -> {collection.present?} do
    Chewy.strategy(:active_job) do
      CollectionsIndex::Collection.update_index(collection)
    end
  end

  after_create if: -> {collection.present?} do
    Chewy.strategy(:active_job) do
      CollectionsIndex::Collection.update_index(collection)
    end
  end

  after_initialize do
    unless contributing_user_id.present? || collection.nil?
      if collection.owner.is_a?(User)
        self.contributing_user_id = collection.owner
      elsif collection.owner.is_a?(Team)
        self.contributing_user_id = collection.owner.leader_users.first
      end
    end
  end

  after_save do
    record.touch
  end

  after_destroy do
    record.touch
  end
end
