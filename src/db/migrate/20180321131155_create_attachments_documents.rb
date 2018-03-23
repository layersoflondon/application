class CreateAttachmentsDocuments < ActiveRecord::Migration[5.2]
  def change
    create_table :attachments_documents do |t|
      t.string :title
      t.text :caption
      t.text :credit

      t.timestamps
    end
  end
end
