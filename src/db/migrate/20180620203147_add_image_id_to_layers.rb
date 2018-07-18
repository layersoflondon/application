class AddImageIdToLayers < ActiveRecord::Migration[5.2]
  def change
    add_column :layers, :image_id, :integer
  end
end
