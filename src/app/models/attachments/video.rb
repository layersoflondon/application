class Attachments::Video < ApplicationRecord
  include Attachments::SharedValidations

  # If we save a url in the youtube_id field, make sure only the ID is saved by parsing it first.
  before_save do
    if youtube_id.match(/^http/)
      youtube_id = YoutubeID.from(youtube_id)
    end
  end
end
