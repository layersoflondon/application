class Tag < ApplicationRecord
  include FriendlyId

  belongs_to :tag_group
  friendly_id :slug_candidates, use: :slugged
  validates_presence_of :name
  has_many :taggings
  has_many :records, through: :taggings, source: :tagger, source_type: "Record"

  acts_as_list column: :sort_order

  default_scope -> {
    order(:sort_order)
  }


  def should_generate_new_friendly_id?
    name_changed? || super
  end

  def slug_candidates
    [
      :name,
      [->{tag_group.name}, :name ]
    ]
  end


end
