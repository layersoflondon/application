class CreateFileAttachments < ActiveRecord::Migration[5.2]
  def change
    create_table :file_attachments do |t|

      t.timestamps
    end
  end
end
