class Attachments::Video < ApplicationRecord
  include SharedValidations
  has_one :attachment, as: :attachable
end
