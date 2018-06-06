class AddLikeAttributesToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :record_likes, :text
  end
end
