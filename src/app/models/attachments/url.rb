class Attachments::Url < ApplicationRecord
  include Attachments::SharedValidations
  has_one :attachment, as: :attachable

  # before_validation :add_http_to_url

  validates_format_of :url, with: URI::DEFAULT_PARSER.regexp[:ABS_URI]
#   this model will respond to url() because there's a column in the database

  # Utility method called when we're indexing this attachment type.
  def data
    {
      url: url
    }
  end

  private

  def add_http_to_url
    unless self.url.match URI::DEFAULT_PARSER.regexp[:ABS_URI]
      self.url = "http://" + self.url
    end
  end
  
end
