class AddContributingUserToCollectionRecords < ActiveRecord::Migration[5.2]
  def change
    add_column :collection_records, :contributing_user_id, :integer
  end
end
