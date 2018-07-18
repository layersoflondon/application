class AddSlugToTaxonomyTerms < ActiveRecord::Migration[5.2]
  def change
    add_column :taxonomies, :title, :string
    add_column :taxonomy_terms, :title, :string
  end
end
