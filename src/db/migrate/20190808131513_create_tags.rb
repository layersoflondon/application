class CreateTags < ActiveRecord::Migration[5.2]
  def change
    create_table :tags do |t|
      t.string :name
      t.string :slug
      t.integer :tag_group_id

      t.timestamps
    end
  end
end
