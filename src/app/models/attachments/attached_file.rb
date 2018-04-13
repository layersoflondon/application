module Attachments
  module AttachedFile
    extend ActiveSupport::Concern

    included do
      has_one_attached :file
      # TODO: check why is not validating presence of file
      validates :file, presence: true
    end
  end
end
