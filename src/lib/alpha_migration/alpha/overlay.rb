module Alpha
  class Overlay < ActiveRecord::Base
  include DatabaseConnection

    has_one :overlay_content_entry, dependent: :destroy
    has_one :content_entry, through: :overlay_content_entry

    validates :lat, :lng, :title, :date_from, presence: true

    def overlay_type
      content_entry.content_type
    end
  end
end

