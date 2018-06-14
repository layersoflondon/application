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
        url: (ApplicationController.helpers.activestorage_url_for(file) rescue nil)
      }
    end
  end
end
