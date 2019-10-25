class AddFeaturedItemColumnToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :featured_item, :boolean, default: false
  end
end
