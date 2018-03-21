class Attachments::Url < ApplicationRecord
  include Attachments::SharedValidations
  has_one :attachment, as: :attachable
end
