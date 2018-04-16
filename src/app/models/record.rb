class Record < ApplicationRecord
  include AASM

  enum state: %i[drafted published pending_review flagged]

  aasm column: :state, enum: true do
    state :drafted, initial: true
    state :published
    state :pending_review
    state :flagged

    event :draft do
      transitions from: %i[], to: :drafted
    end

    event :review do
      transitions from: %i[drafted flagged], to: :pending_review
    end

    event :publish do
      transitions from: %i[pending_review], to: :published
    end

    event :flag do
      transitions from: %i[pending_review published], to: :flagged
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

  validates :title, :state, presence: true, if: -> { state == 'drafted' }
  validates :title, :description, :state, :lat, :lng, :date, :location, presence: true, if: -> { state != 'drafted' }
  validates :title, length: { in: 3..255 }, if: -> { state != 'drafted' }
  validates :description, length: { minimum: 3 }, if: -> { state != 'drafted' }
  validates :lat, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }, if: -> { state != 'drafted' }
  validates :lng, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }, if: -> { state != 'drafted' }
  validates_format_of :date, with: /\d{4}-\d{2}-\d{2}/, message: '^Date must be in the following format: yyyy-dd-mm', if: -> { state != 'drafted' }
  # TODO: is there a standard rails validator for dates? not sure.
  validate :date_is_in_the_past, if: -> { state != 'drafted' }

  validates :user, presence: true # , unless: ->(r) {r.orphan?}

  serialize :location, Hash

  scope :orphan, -> {
    where(user: nil)
  }

  def date_is_in_the_past
    errors.add(:date, 'date is not in the past') if date.present? && Date.today < date
  end

  def primary_image
    # TODO: get primary image or first found
    # attachments.where(attachable_type: 'Attachments::Image').first
    # attachments.images.where(primary: true).first || attachments.images.first
    'http://placehold.it/900x400s'
  end
end
