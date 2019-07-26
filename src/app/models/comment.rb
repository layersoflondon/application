class Comment < ApplicationRecord
  include AASM

  belongs_to :user
  belongs_to :record

  # validates :content, presence: true
  validate :content_length

  def other_thread_participants
    record.comment_thread_participants.reject {|u| u == self.user }
  end

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

  after_create if: :published? do
    CommentsMailer.owner_comment_notification(self).deliver_later
    other_thread_participants.each do |user|
      CommentsMailer.reply_notification(self, user).deliver_later
    end
  end

  private
  def check_content
    Nokogiri
  end
end
