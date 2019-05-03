class AddLayerGroupLayerReference < ActiveRecord::Migration[5.2]
  def change
    add_reference :layers, :layer_group, index: true

    Layer.all.each do |layer|
      group = LayerGroup.create(name: layer.title, description: "#{layer.title} group")
      layer.layer_group = group
      layer.save
    end
  end
end
