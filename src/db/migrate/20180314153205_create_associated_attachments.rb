class CreateAssociatedAttachments < ActiveRecord::Migration[5.2]
  def change
    create_table :associated_attachments do |t|
      t.references :file_attachment, foreign_key: true
      t.references :record, foreign_key: true
      t.integer :type_attachment
      t.string :caption
      t.string :credits
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end
