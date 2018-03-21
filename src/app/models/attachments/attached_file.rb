module Attachments
  module AttachedFile
    extend ActiveSupport::Concern

    included do
      has_one_attached :file

      validates :file, presence: true
    end

    def url
      Rails.application.routes.url_helpers.url_for(file)
    end
  end
end