class FileAttachment < ApplicationRecord
  has_many :associated_attachments
  has_many :file_attachments, through: :associated_attachments
  has_one_attached :content
end
