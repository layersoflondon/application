class Attachments::Document < ApplicationRecord
  include SharedValidations
  has_one :attachment, as: :attachable
end
