# A simple model to feature Records and Collections on the marketing site
class FeaturedItem < ApplicationRecord
  acts_as_list column: :sort_order
  belongs_to :item, polymorphic: true


  validates_presence_of :item_id

  update_index('featured_items#featured_item') { self }

  after_create -> {
    item.class.update_index_value!(item.id, :featured_item, true)
  }

  after_destroy -> {
    item.class.update_index_value!(item.id, :featured_item, false)
  }
end


