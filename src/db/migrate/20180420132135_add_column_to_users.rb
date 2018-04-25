class AddColumnToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :description, :text
    add_column :users, :contact_me, :boolean
  end
end
