class AddFeaturedItemColumnToRecords < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :featured_item, :boolean, default: false
  end
end
