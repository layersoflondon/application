class CreateRecordAttachments < ActiveRecord::Migration[5.2]
  def change
    create_table :record_attachments do |t|
      t.references :record, foreign_key: true
      t.references :attachment, foreign_key: true
      t.boolean :primary_image

      t.timestamps
    end
  end
end
