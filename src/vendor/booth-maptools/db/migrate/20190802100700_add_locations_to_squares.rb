class AddLocationsToSquares < ActiveRecord::Migration[5.2]
  def change
    add_column :layers_of_london_booth_map_tool_squares, :north_west, :string
    add_column :layers_of_london_booth_map_tool_squares, :geojson, :text
    add_column :layers_of_london_booth_map_tool_squares, :square_size, :integer


  end
end

