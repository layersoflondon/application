class CreateRecordTaxonomyTerms < ActiveRecord::Migration[5.2]
  def change
    create_table :record_taxonomy_terms do |t|
      t.references :record, foreign_key: true
      t.references :taxonomy_term, foreign_key: true

      t.timestamps
    end
  end
end
