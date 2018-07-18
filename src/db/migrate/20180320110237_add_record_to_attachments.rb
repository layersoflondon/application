class AddRecordToAttachments < ActiveRecord::Migration[5.2]
  def change
    add_reference :attachments, :record, foreign_key: true
  end
end
