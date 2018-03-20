class   FileAttachment < ApplicationRecord
  # I think we can make this a polymorphic relationship to associated_attachment like this:
  # has_one :associated_attachment, as: :attachment
  # has_one_attached :file
  # I've changed the suggested name of the attachment to file because 'content' doesn't quite fit with the domain model - it's a file - but this is only a nicety. 'content' is probably ok too.

  has_many :associated_attachments
  has_many :file_attachments, through: :associated_attachments
  has_one_attached :content
end
