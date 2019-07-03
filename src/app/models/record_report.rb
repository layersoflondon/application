class RecordReport < ApplicationRecord
  belongs_to :record
  belongs_to :comment, optional: true
  belongs_to :user, optional: true

  validates_presence_of :message
  validates_presence_of :email, unless: -> {user.present?}

  validates :issue, presence: true, inclusion: {in: %w(copyright inaccurate inappropriate comment)}
  after_create :send_admin_message

  private

  def send_admin_message
    RecordReportMailer.admin_notification(self).deliver_now
  end
end
