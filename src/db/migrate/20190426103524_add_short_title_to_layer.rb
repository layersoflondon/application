class AddShortTitleToLayer < ActiveRecord::Migration[5.2]
  def change
    add_column :layers, :short_title, :string
  end
end
