class CreateAttachmentsUrls < ActiveRecord::Migration[5.2]
  def change
    create_table :attachments_urls do |t|
      t.string :title
      t.text :caption
      t.text :credit
      t.text :url

      t.timestamps
    end
  end
end
