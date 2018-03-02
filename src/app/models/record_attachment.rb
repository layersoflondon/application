class RecordAttachment < ApplicationRecord
  belongs_to :record
  belongs_to :attachment
end
