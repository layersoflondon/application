class CreateAttachmentsImages < ActiveRecord::Migration[5.2]
  def change
    create_table :attachments_images do |t|
      t.string :title
      t.text :caption
      t.text :credit
      t.boolean :primary, :boolean, null: false, default: false

      t.timestamps
    end
  end
end
