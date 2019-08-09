class TagGroup < ApplicationRecord
  include FriendlyId

  friendly_id :name
  has_many :tags, dependent: :destroy

  acts_as_list column: :sort_order

  validates_presence_of :name

  default_scope -> {
    order(:sort_order)
  }

  def should_generate_new_friendly_id?
    name_changed? || super
  end
end
