class Attachments::Geodata < ApplicationRecord
  include Attachments::SharedValidations
  include Attachments::AttachedFile
  has_one :attachment, as: :attachable

  validate :validate_text_file

  private

  def validate_file
    errors.add(:attachment, 'file is not text') unless file.try(:text?)
  end
end
