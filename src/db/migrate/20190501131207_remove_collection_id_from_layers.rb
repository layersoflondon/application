class RemoveCollectionIdFromLayers < ActiveRecord::Migration[5.2]
  def change
    remove_column :layers, :collection_id
  end
end
