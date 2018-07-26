module Attachments
  class AudioFile < ApplicationRecord
    include Attachments::SharedValidations
    include Attachments::AttachedFile
    has_one :attachment, as: :attachable

    validate :validate_audio_file


    # Utility method used when we index
    def data
      super.merge(
             {
               thumb: ActionController::Base.helpers.asset_path("/audio-image-thumb.jpeg"),
               poster: ActionController::Base.helpers.asset_path("/audio-image.jpeg")
             }
      )
    end

    private

    def validate_audio_file
      errors.add(:attachment, 'file is not audio') unless file.try(:audio?)
    end
  end
end
