class Attachments::Url < ApplicationRecord
  include SharedValidations
  has_one :attachment, as: :attachable
end
