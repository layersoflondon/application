class Attachments::Video < ApplicationRecord
  include Attachments::SharedValidations
  # TODO for now we just accept a youtube_url
  # include Attachments::AttachedFile
  has_one :attachment, as: :attachable

end
