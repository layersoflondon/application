class AddLayermakerCountToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :layermaker_count, :integer, default: 0
  end
end
