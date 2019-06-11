class AddDataFileAttributesToLayer < ActiveRecord::Migration[5.2]
  def change
    # remove_column :layers, :image_id
    add_column :layers, :data_id, :integer
  end
end
