class Attachments::Dataset < ApplicationRecord
  include SharedValidations
  has_one :attachment, as: :attachable




end
