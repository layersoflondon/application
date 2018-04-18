class Record < ApplicationRecord
  include AASM

  enum state: %i[draft published pending_review flagged deleted]

  aasm column: :state, enum: true do
    state :draft, initial: true
    state :published
    state :pending_review
    state :flagged
    state :deleted

    event :mark_as_draft do
      transitions from: %i[draft], to: :draft
    end

    event :mark_as_pending_review do
      transitions from: %i[draft flagged pending_review], to: :pending_review
    end

    event :mark_as_published do
      transitions from: %i[pending_review published], to: :published
    end

    event :mark_as_flagged do
      transitions from: %i[pending_review published flagged], to: :flagged
    end

    event :mark_as_deleted do
      transitions from: %i[draft published pending_review flagged], to: :deleted
    end

  end

  has_many :collection_records
  has_many :collections, through: :collection_records
  has_many :attachments
  belongs_to :user
  accepts_nested_attributes_for :attachments

  # TODO: use the AASM gem to make this a proper state machine. Uses a string column called aasm
  # state by default. See https://github.com/aasm/aasm
  # enum state: %i[draft published pending_review flagged]

  validates :title, :state, presence: true, if: -> { state == 'draft' }
  validates :title, :description, :state, :lat, :lng, :date, :location, presence: true, if: -> { state != 'draft' }
  validates :title, length: { in: 3..255 }, if: -> { state != 'draft' }
  validates :description, length: { minimum: 3 }, if: -> { state != 'draft' }
  validates :lat, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }, if: -> { state != 'draft' }
  validates :lng, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }, if: -> { state != 'draft' }
  validates_format_of :date, with: /\d{4}-\d{2}-\d{2}/, message: '^Date must be in the following format: yyyy-dd-mm', if: -> { state != 'draft' }
  # TODO: is there a standard rails validator for dates? not sure.
  validate :date_is_in_the_past, if: -> { state != 'draft' }

  validates :user, presence: true # , unless: ->(r) {r.orphan?}

  serialize :location, Hash

  scope :orphan, -> {
    where(user: nil)
  }

  def date_is_in_the_past
    errors.add(:date, 'date is not in the past') if date.present? && Date.today < date
  end
end
