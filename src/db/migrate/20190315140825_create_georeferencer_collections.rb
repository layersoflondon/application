class CreateGeoreferencerCollections < ActiveRecord::Migration[5.2]
  def change
    create_table :georeferencer_collections do |t|
      t.string :name
      t.text :description
      t.string :georeferencer_id, index: true
      t.integer :image_id

      t.timestamps
    end
  end
end
