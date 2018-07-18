module Alpha
  class ContentType < ActiveRecord::Base
  include DatabaseConnection
    enum suitability: [:for_pins, :for_overlays, :for_both]

    has_many :content_entries

    validates_presence_of :name
    validates_uniqueness_of :name

    scope :for_pins, -> {
      where("suitability in (?)", [suitabilities[:for_pins], suitabilities[:for_both]])
    }

    scope :for_overlays, -> {
      where("suitability in (?)", [suitabilities[:for_overlays], suitabilities[:for_both]])
    }

  end
end

