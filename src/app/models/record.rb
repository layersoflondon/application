class Record < ApplicationRecord
  has_many :collection_records
  has_many :collections, through: :collection_records

  # TODO I think we can do this with a polymorphic association on associated_attachment - that just leaves has_many :associated_attachments as the association in here.
  has_many :associated_attachments
  # has_many :data_attachments, through: :associated_attachments
  has_many :file_attachments, through: :associated_attachments

  # TODO - use the AASM gem to make this a proper state machine. Uses a string column called aasm_state by default. See https://github.com/aasm/aasm
  enum state: %i[draft published pending_review flagged]

  validates :title, :description, :state, :lat, :lng, :date, presence: true
  validates :title, length: { in: 3..255 }
  validates :description, length: { minimum: 3 }
  validates :lat, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }
  validates :lng, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
  validates_format_of :date, with: /\d{4}-\d{2}-\d{2}/, message: '^Date must be in the following format: yyyy-dd-mm'
  # TODO is there a standard rails validator for dates? not sure.
  validate :date_is_in_the_past

  def date_is_in_the_past
    errors.add(:date, 'date is not in the past') if date.present? && Date.today < date
  end
end
