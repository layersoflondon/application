class AddCaptionAndCreditToAttachmentsTexts < ActiveRecord::Migration[5.2]
  def change
    add_column :attachments_texts, :caption, :text
    add_column :attachments_texts, :credit, :text
  end
end
