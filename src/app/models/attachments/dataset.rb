class Attachments::Dataset < ApplicationRecord
  include Attachments::SharedValidations
  include Attachments::AttachedFile
  has_one :attachment, as: :attachable

  validate :validate_text_file

  private

  def validate_text_file
    # errors.add(:attachment, 'file is not text') unless file.try(:text?)
  end
end
