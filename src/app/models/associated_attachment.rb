class AssociatedAttachment < ApplicationRecord
  # TODO I think we could refactor this into:
  # belongs_to :attachment, polymorphic: true
  #
  #
  # That would mean that FileAttachment and DataAttachment will be different models, and they'll be associated with this AssociatedAttachment with a 'type' field and an attachment_id field.

  belongs_to :file_attachment
  belongs_to :record
end
