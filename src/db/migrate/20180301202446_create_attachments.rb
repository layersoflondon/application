class CreateAttachments < ActiveRecord::Migration[5.2]
  def change
    create_table :attachments do |t|
      t.integer :attachment_type
      t.integer :state
      t.text :attachment_data
      t.string :mime_type
      t.integer :file_size

      t.timestamps
    end
  end
end
