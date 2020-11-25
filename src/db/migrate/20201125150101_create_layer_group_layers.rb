class CreateLayerGroupLayers < ActiveRecord::Migration[5.2]
  def up
    create_table :layer_group_layers do |t|
      t.references :layer_group, foreign_key: true
      t.references :layer, foreign_key: true

      t.timestamps
    end

    # puts "Migrating layer group IDs to join table"
    # Layer.all.each do |layer|
    #   puts "Layer #{layer.id}"
    #   LayerGroupLayer.create(layer: layer, layer_group: layer.layer_group)
    # end

    # remove_column :layers, :layer_group_id
  end

  def down
    add_column :layers, :layer_group_id

    # puts "Migration layer group IDs back into layers"
    # LayerGroupLayer.all.each do |lgl|
    #   puts "Layer ID #{lgl.layer.id}"
    # #   we can't associate the layer to more than one layer group on the 'down' migration so we'll just do one.
    # lgl.layer.update_column(:layer_group_id, lgl.layer.id) unless lgl.layer.layer_group_id.present?
    # end

    drop_table :layer_group_layers
  end
end
