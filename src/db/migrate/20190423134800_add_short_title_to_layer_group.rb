class AddShortTitleToLayerGroup < ActiveRecord::Migration[5.2]
  def change
    add_column :layer_groups, :short_name, :string
  end
end
