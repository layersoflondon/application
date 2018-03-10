class Record < ApplicationRecord
  has_many :collection_records
  has_many :collections, through: :collection_records
  has_many_attached :images
  has_many_attached :documents

  enum state: %i[draft published pending_review flagged]

  validates :title, :description, :state, :lat, :lng, :date, presence: true
  validates :title, length: { in: 3..255 }
  validates :description, length: { minimum: 3 }
  validates :lat, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }
  validates :lng, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
  validates_format_of :date, with: /\d{4}-\d{2}-\d{2}/, message: '^Date must be in the following format: yyyy-dd-mm'
  validate :date_is_in_the_past

  def date_is_in_the_past
    if date.present? && Date.today < date
      errors.add(:date, 'date is not in the past')
    end
  end
end
