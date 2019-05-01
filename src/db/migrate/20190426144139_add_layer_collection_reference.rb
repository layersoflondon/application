class AddLayerCollectionReference < ActiveRecord::Migration[5.2]
  def change
    add_column :layers, :collection_id, :integer
  end
end
