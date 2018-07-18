class CreateAttachmentsVideos < ActiveRecord::Migration[5.2]
  def change
    create_table :attachments_videos do |t|
      t.string :title
      t.text :caption
      t.text :credit
      t.string :youtube_id

      t.timestamps
    end
  end
end
