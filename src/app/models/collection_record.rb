class CollectionRecord < ApplicationRecord
  belongs_to :collection
  belongs_to :record

  belongs_to :contributing_user, class_name: "User"

  validates_presence_of :contributing_user_id
  validates_uniqueness_of :collection, scope: :record

  after_initialize do
    self.contributing_user = collection.owner unless self.contributing_user_id.present?
  end

  after_save do
    record.touch
  end

  after_destroy do
    record.touch
  end
end
