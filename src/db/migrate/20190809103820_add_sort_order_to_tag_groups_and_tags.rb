class AddSortOrderToTagGroupsAndTags < ActiveRecord::Migration[5.2]
  def change
    add_column :tags, :sort_order, :integer, null: true
    add_column :tag_groups, :sort_order, :integer, null: true

  end
end
