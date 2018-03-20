class CreateAttachments < ActiveRecord::Migration[5.2]
  def change
    create_table :attachments do |t|
      t.integer :attachable_id
      t.string :attachable_type
      t.string :caption
      t.string :credits
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end
