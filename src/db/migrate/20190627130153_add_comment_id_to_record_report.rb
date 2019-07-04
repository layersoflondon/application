class AddCommentIdToRecordReport < ActiveRecord::Migration[5.2]
  def change
    add_column :record_reports, :comment_id, :integer
  end
end
