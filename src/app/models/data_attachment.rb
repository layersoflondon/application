class DataAttachment < ApplicationRecord
  # TODO this is what I think we need to support a polymorphic relationship
  has_one :associated_attachment, as: :attachment
end