class AddViewTypeToRecord < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :view_type, :integer, default: 0
  end
end
