class RecordTaxonomyTerm < ApplicationRecord
  belongs_to :record
  belongs_to :taxonomy_term
end
