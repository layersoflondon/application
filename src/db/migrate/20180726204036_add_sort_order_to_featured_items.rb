class AddSortOrderToFeaturedItems < ActiveRecord::Migration[5.2]
  def change
    add_column :featured_items, :sort_order, :integer
  end
end
