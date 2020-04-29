class CreateLayersOfLondonBoothMapToolSquares < ActiveRecord::Migration[5.2]
  def change
    create_table :layers_of_london_booth_map_tool_squares do |t|
      t.timestamps
    end
  end
end
