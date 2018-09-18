class AddCreditToLayers < ActiveRecord::Migration[5.2]
  def change
    add_column :layers, :credit, :text
  end
end
