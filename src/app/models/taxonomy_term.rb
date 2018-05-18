class TaxonomyTerm < ApplicationRecord
  belongs_to :taxonomy
  has_many :records_taxonomy_terms
  has_many :records, through: :record_taxonomy_terms
end
