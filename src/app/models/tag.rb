class Tag < ApplicationRecord
  include FriendlyId

  belongs_to :tag_group
  friendly_id :name
  validates_presence_of :name
  has_many :taggings
  has_many :records, through: :taggings, source: :tagger, source_type: "Record"


  def should_generate_new_friendly_id?
    name_changed? || super
  end


end
