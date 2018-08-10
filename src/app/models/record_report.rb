class RecordReport < ApplicationRecord
  belongs_to :record
  belongs_to :user

  validates_presence_of :issue, :message

  after_create :flag_record

  private
  def flag_record
    self.record.mark_as_flagged! if self.record.may_mark_as_flagged?
  end
end
