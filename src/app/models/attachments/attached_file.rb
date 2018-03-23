module Attachments
  module AttachedFile
    extend ActiveSupport::Concern

    included do
      has_one_attached :file
      # TODO: check why is not validating presence of file
      validates :file, presence: true
    end
    # TODO this doesn't work but we would like to have url return a path to the file. Might not be possible in the model layer.
    # def url
    #   Rails.application.routes.url_helpers.url_for(self, only_path: true)
    # end
  end
end
