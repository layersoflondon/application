class Collection < ApplicationRecord
  # belongs_to :owner, polymorphic: true
  has_many :collection_records
  has_many :records, through: :collection_records

  # TODO: permissions for reading and writing should go in a Pundit policy (see https://github.com/varvet/pundit).
  # I think we still need these enums though.
  enum read_state: %i[public_read private_read]
  enum write_state: %i[everyone team creator]

  validates :title, :description, presence: true
  validates :title, length: { in: 3..255 }
  validates :description, length: { minimum: 3 }
end
