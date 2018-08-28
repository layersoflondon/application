class RecordReport < ApplicationRecord
  belongs_to :record
  belongs_to :user

  validates_presence_of :issue, :message
end
