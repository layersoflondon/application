class Attachments::Geodata < ApplicationRecord
  include SharedValidations
  has_one :attachment, as: :attachable
end
