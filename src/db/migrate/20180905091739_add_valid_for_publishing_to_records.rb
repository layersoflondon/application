class AddValidForPublishingToRecords < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :valid_for_publishing, :boolean
    add_column :records, :errors_on_publishing, :text
  end
end
