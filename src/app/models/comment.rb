class Comment < ApplicationRecord
  has_one :user_record_comment
  has_one :user, through: :user_record_comment
  has_one :record, through: :user_record_comment

  enum state: %i[draft published pending_review flagged deleted]
end
