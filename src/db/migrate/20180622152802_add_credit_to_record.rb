class AddCreditToRecord < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :credit, :text
    add_column :records, :credit_image_id, :integer
  end
end
