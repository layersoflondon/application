class AddViewCountToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :view_count, :integer, default: 0
  end
end
