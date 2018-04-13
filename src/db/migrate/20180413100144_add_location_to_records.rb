class AddLocationToRecords < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :location, :text, null: false
  end
end
