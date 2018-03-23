class Attachments::Url < ApplicationRecord
  include Attachments::SharedValidations
  has_one :attachment, as: :attachable
#   this model will respond to url() because there's a column in the database
end
