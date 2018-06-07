class Record < ApplicationRecord
  include RecordsQuery
  include AASM

  update_index('records#record') { self }
  has_many :collection_records
  has_many :collections, through: :collection_records
  has_many :attachments
  update_index('attachments#attachment') { attachments }
  belongs_to :user
  update_index 'users#user' do
    previous_changes['user_id'] || user
  end
  has_one :primary_image, class_name: 'Attachments::Image', foreign_key: :id, primary_key: :primary_image_id
  has_many :record_taxonomy_terms, class_name: 'RecordTaxonomyTerm'
  has_many :taxonomy_terms, through: :record_taxonomy_terms

  accepts_nested_attributes_for :attachments

  enum state: %i[draft published pending_review flagged deleted]
  serialize :location, Hash

  validates :title, :state, presence: true, if: -> { state == 'draft' }
  validates :title, :description, :state, :lat, :lng, :date_from, :location, presence: true, if: -> { state != 'draft' }
  validates :title, length: { in: 3..255 }, if: -> { state != 'draft' }
  validates :description, length: { minimum: 3 }, if: -> { state != 'draft' }
  validates :lat, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }, if: -> { state != 'draft' }
  validates :lng, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }, if: -> { state != 'draft' }
  validates_format_of :date_from, with: /\d{4}-\d{2}-\d{2}/, message: '^Date must be in the following format: yyyy-dd-mm', if: -> { state != 'draft' }
  # TODO: is there a standard rails validator for dates? not sure.
  validate :date_is_in_the_past, if: -> { state != 'draft' }

  validates :user, presence: true # , unless: ->(r) {r.orphan?}

  scope :orphan, -> {
    where(user: nil)
  }

  def date_is_in_the_past
    errors.add(:date_from, 'date is not in the past') if date_from.present? && Date.today < date_from
  end

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

  def get_primary_image(fallback_to_first: true)
    if primary_image_id && primary_image
      primary_image
    end

    images = attachments.where(attachable_type: "Attachments::Image")
    image = images.select{|a| a.attachable.attachment.is_primary?}.first

    if !image && fallback_to_first
      images.first if fallback_to_first && !image
    else
      image
    end
  end
end
