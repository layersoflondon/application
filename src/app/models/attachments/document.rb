class Attachments::Document < ApplicationRecord
  include Attachments::SharedValidations
  include Attachments::AttachedFile
  has_one :attachment, as: :attachable

  validate :validate_file

  private

  def validate_file
    byebug
    # errors.add(:attachment, 'file is not text') unless file.try(:text?)
  end
end
