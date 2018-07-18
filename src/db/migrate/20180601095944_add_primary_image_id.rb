class AddPrimaryImageId < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :primary_image_id, :integer
  end
end
