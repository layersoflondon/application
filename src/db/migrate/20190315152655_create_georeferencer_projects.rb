class CreateGeoreferencerProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :georeferencer_projects do |t|
      t.string :name
      t.text :description
      t.string :georeferencer_id
      t.integer :image_id
      t.string :slug

      t.timestamps
    end
  end
end
