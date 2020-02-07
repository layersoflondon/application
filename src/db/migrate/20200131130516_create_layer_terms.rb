class CreateLayerTerms < ActiveRecord::Migration[5.2]
  def change
    create_table :layer_terms do |t|
      t.string :name
      t.references :layer_category, foreign_key: true

      t.timestamps
    end
  end
end
