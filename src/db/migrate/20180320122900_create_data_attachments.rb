class CreateDataAttachments < ActiveRecord::Migration[5.2]
  def change
    create_table :data_attachments do |t|
      t.text :content

      t.timestamps
    end
  end
end
