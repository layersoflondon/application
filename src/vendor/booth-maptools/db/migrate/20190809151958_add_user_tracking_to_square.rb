class AddUserTrackingToSquare < ActiveRecord::Migration[5.2]
  def change
    add_column :layers_of_london_booth_map_tool_squares, :user_id, :integer
  end
end
