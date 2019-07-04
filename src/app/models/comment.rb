class Comment < ApplicationRecord
  include AASM

  belongs_to :user
  belongs_to :record

  # validates :content, presence: true
  validate :content_length

  def content_length
    errors.add(:content, "can't be blank") unless Nokogiri::HTML.fragment(self.content).text.strip.size>0
  end

  aasm column: :state do
    state :draft, initial: true
    state :published, :flagged, :deleted

    event :publish do
      transitions from: %i[draft], to: :published
    end

    event :flag do
      transitions from: %i[published], to: :flagged
    end

    event :delete do
      transitions from: %i[draft published flagged], to: :deleted
    end
  end

  private
  def check_content
    Nokogiri
  end
end
