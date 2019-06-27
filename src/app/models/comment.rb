class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :record

  enum state: %i[draft published pending_review flagged deleted]
end
