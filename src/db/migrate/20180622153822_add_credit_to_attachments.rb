class AddCreditToAttachments < ActiveRecord::Migration[5.2]
  def change
    add_column :attachments, :credit, :text
  end
end
