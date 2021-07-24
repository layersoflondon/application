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

    # Utility method used when we index
    def data
      {
        content_type: file.try(:content_type),
        suffix: Mime::Type.lookup(file.try(:content_type)).try(:symbol) || :unknown,
        url: (file.service_url rescue nil)
      }
    end
  end
end
