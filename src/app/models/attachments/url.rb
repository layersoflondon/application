class Attachments::Url < ApplicationRecord
  include Attachments::SharedValidations
  has_one :attachment, as: :attachable

  # before_validation :add_http_to_url

  validate :url_must_be_valid
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

  def url_must_be_valid
    begin
      unless URI.parse(url).kind_of?(URI::HTTP)
        errors.add(:url, "The link URL isn't in an accepted format")
      end
    rescue URI::InvalidURIError
      errors.add(:url, "The link URL isn't in an accepted format")
    end
  end
end
