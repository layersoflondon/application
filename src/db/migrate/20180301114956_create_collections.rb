class CreateCollections < ActiveRecord::Migration[5.2]
  def change
    create_table :collections do |t|
      t.string :title
      t.text :description
      t.references :owner, polymorphic: true
      t.integer :attachment_id
      t.integer :read_state
      t.integer :write_state
      t.integer :creator_id

      t.timestamps
    end
  end
end
