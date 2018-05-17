class CreateTaxonomyTerms < ActiveRecord::Migration[5.2]
  def change
    create_table :taxonomy_terms do |t|
      t.string :name
      t.references :taxonomy, foreign_key: true

      t.timestamps
    end
  end
end
