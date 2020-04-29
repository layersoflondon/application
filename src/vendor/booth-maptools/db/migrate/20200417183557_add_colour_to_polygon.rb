class AddColourToPolygon < ActiveRecord::Migration[5.2]
  def up
    LayersOfLondon::Booth::MapTool::Polygon.transaction do
      add_column :layers_of_london_booth_map_tool_polygons, :colour, :integer, null: true, index: :polygon_colour

      polygons = LayersOfLondon::Booth::MapTool::Polygon.all
      grouped = polygons.group_by {|p| p.feature["properties"]["colour"]}
      grouped.each do |colour, polys|
        ids = polys.collect(&:id)
        colour = colour.in?(LayersOfLondon::Booth::MapTool::Polygon.colours.keys) ? colour : :unknown
        LayersOfLondon::Booth::MapTool::Polygon.where(id: ids).update_all(colour: colour)
      end
    end
  end

  def down
    remove_column :layers_of_london_booth_map_tool_polygons, :colour, :integer
  end
end
