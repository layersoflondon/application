class AddPrimaryToAttachmentsImages < ActiveRecord::Migration[5.2]
  def change
    add_column :attachments_images, :primary, :boolean, null: false, default: false
  end
end
