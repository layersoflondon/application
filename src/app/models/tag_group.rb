class TagGroup < ApplicationRecord
  include FriendlyId

  friendly_id :name
  has_many :tags, dependent: :destroy

  validates_presence_of :name

  def should_generate_new_friendly_id?
    name_changed? || super
  end
end
