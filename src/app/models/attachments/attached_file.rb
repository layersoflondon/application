module Attachments
  module AttachedFile
    extend ActiveSupport::Concern

    included do
      has_one_attached :file

      validate :validate_file

      def validate_file
        errors.add(:attachment, 'file is not attached') unless file.attached?
      end
    end
  end
end
