class CollectionRecord < ApplicationRecord
  belongs_to :collection
  belongs_to :record

  belongs_to :contributing_user, class_name: "User"

  validates_presence_of :contributing_user_id
  validates_uniqueness_of :collection, scope: :record

  after_save do
    record.touch
    collection.touch
  end

  after_destroy do
    record.touch
    collection.touch
  end
end
