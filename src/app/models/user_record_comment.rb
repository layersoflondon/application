class UserRecordComment < ApplicationRecord
  belongs_to :user
  belongs_to :record
  belongs_to :comment
end
