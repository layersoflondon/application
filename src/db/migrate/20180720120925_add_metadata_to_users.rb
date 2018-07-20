class AddMetadataToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :metadata, :text
  end
end
