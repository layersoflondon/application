class FileAttachment < ApplicationRecord
  has_many :attachments, as: :attachable
  has_one_attached :file
end
