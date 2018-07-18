class CreateAttachmentsDatasets < ActiveRecord::Migration[5.2]
  def change
    create_table :attachments_datasets do |t|
      t.string :title
      t.text :caption
      t.text :credit

      t.timestamps
    end
  end
end
