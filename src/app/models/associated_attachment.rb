class AssociatedAttachment < ApplicationRecord
  belongs_to :file_attachment
  belongs_to :record
end
