class Attachments::Geodata < ApplicationRecord
  include Attachments::SharedValidations
  include Attachments::AttachedFile
  has_one :attachment, as: :attachable

  validate :validate_json_file

  private

  def validate_json_file
    # todo find out how do we validate an application/json content type
    # errors.add(:attachment, 'file is not text') unless file.try(:text?)
  end
end
