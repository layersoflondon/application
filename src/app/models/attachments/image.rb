class Attachments::Image < ApplicationRecord
  include Attachments::SharedValidations
  include Attachments::AttachedFile
  has_one :attachment, as: :attachable

  validate :validate_image_file

  private

  def validate_file
    errors.add(:attachment, 'File is not image') unless file.try(:image?)
  end
end
