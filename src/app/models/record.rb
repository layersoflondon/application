class Record < ApplicationRecord
  has_many :collection_records
  has_many :collections, through: :collection_records
  has_many :attachments
  belongs_to :user
  accepts_nested_attributes_for :attachments

  # TODO: use the AASM gem to make this a proper state machine. Uses a string column called aasm
  # state by default. See https://github.com/aasm/aasm
  enum state: %i[draft published pending_review flagged]

  validates :title, :state, :lat, :lng, presence: true
  validates :description, :date, presence: true
  validates :title, length: { in: 3..255 }
  validates :description, length: { minimum: 3 }
  validates :lat, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }
  validates :lng, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
  validates_format_of :date, with: /\d{4}-\d{2}-\d{2}/, message: '^Date must be in the following format: yyyy-dd-mm'
  # TODO: is there a standard rails validator for dates? not sure.
  validate :date_is_in_the_past

  validates :user, presence: true#, unless: ->(r) {r.orphan?}

  serialize :location, Hash

  scope :orphan, ->() {
    where(user: nil)
  }

  def date_is_in_the_past
    errors.add(:date, 'date is not in the past') if date.present? && Date.today < date
  end

  # TODO - replace with AASM state machine
  def published?
    true
  end

  def primary_image
    # attachments.where(primary: true).first || attachments.where(type: 'image').first
    "http://placehold.it/900x400"
  end
end
