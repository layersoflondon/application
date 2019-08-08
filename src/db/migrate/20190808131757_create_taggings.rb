class CreateTaggings < ActiveRecord::Migration[5.2]
  def change
    create_table :taggings do |t|
      t.integer :tag_id
      t.string :tagger_type
      t.integer :tagger_id

      t.timestamps
    end
  end
end
