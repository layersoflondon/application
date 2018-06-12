class Attachments::Audio < ApplicationRecord
  include Attachments::SharedValidations
  include Attachments::AttachedFile
  has_one :attachment, as: :attachable

  validate :validate_audio_file

  private

  def validate_audio_file
    errors.add(:attachment, 'file is not audio') unless file.try(:audio?)
  end
end
