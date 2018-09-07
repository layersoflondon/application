module Attachments
  module SharedValidations
    extend ActiveSupport::Concern

    included do
      # validates :title, presence: {message: 'must be included'}
      # TODO - do we want to validate these fields? not sure.
      # validates :credit, presence: {message: 'must be included'}
      # validates :description, presence: {message: 'must be included'}
    end
  end
end