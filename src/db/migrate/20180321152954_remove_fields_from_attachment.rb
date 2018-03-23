class RemoveFieldsFromAttachment < ActiveRecord::Migration[5.2]
  def change
    remove_column :attachments, :caption, :string
    remove_column :attachments, :credits, :string
    remove_column :attachments, :name, :string
    remove_column :attachments, :description, :text
  end                  
end
