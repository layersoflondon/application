class AddHighlightedToLayerGroups < ActiveRecord::Migration[5.2]
  def change
    add_column :layer_groups, :highlighted, :boolean, default:false
  end
end
