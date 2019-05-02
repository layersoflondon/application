class RemoveLayerDataColumns < ActiveRecord::Migration[5.2]
  def change
    remove_column :layers, :data_id
  end
end
