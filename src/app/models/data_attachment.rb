class DataAttachment < ApplicationRecord
  has_many :attachments, as: :attachable
end
