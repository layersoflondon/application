class CreateLayersOfLondonBoothMapToolPolygons < ActiveRecord::Migration[5.2]
  def change
    create_table :layers_of_london_booth_map_tool_polygons do |t|
      t.references :square
      t.belongs_to :user
      t.text :feature
      t.timestamps
    end
  end
end
