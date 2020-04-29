class AddNorthWestSouthEastToSquares < ActiveRecord::Migration[5.2]
  def change
    remove_column :layers_of_london_booth_map_tool_squares, :north_west, :string
    add_column :layers_of_london_booth_map_tool_squares, :north_west_lat, :float
    add_column :layers_of_london_booth_map_tool_squares, :north_west_lng, :float
    add_column :layers_of_london_booth_map_tool_squares, :south_east_lat, :float
    add_column :layers_of_london_booth_map_tool_squares, :south_east_lng, :float


  end
end

