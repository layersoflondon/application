module Alpha
  class GeoreferencedImage < ActiveRecord::Base
  include DatabaseConnection
    include AASM
    serialize :metadata, JSON

    validates :wmts_url, presence: true
    validates :georeferencer_id, presence: true, uniqueness: true
    validates :georeferencer_ref, presence: true, uniqueness: true

    aasm do
      state :pending, initial: true
      state :published
      state :flagged

      event :publish do
        transitions from: :pending, to: :published
      end

      event :flag do
        transitions from: :published, to: :flagged
      end
    end

    after_initialize do
      self.metadata ||= {}
    end
    before_validation :parse_wmts, on: :create

    def tile_url
      if metadata["tile_url"].present?
        metadata["tile_url"].gsub('TileMatrix','z').gsub('TileCol','x').gsub('TileRow','y').gsub("maps", "maps-#{rand(0..3)}")
      else
        nil
      end
    end

    private
    def parse_wmts
      begin
        doc = Nokogiri::XML(open(wmts_url))
        doc.remove_namespaces!
        tile_url = doc.css('Contents Layer ResourceURL').attr('template').value
        sw = doc.css('WGS84BoundingBox LowerCorner').text.split(" ").reverse
        ne = doc.css('WGS84BoundingBox UpperCorner').text.split(" ").reverse
        self.metadata[:tile_url] = tile_url
        self.georeferencer_id = tile_url.split("/")[4]
        self.north_east = ne.join(",")
        self.south_west = sw.join(",")

        # calculate the centroid
        msw = Matrix[sw.collect(&:to_f)]
        mne = Matrix[ne.collect(&:to_f)]
        center = (msw + ((mne - msw) / 2)).round(6)
        self.center = center.to_a.flatten.join(",")

        self.aasm_state = :published


      rescue => e
        self.errors.add :base, "Couldn't parse WMTS info: #{e}"
      end


    end

  end

end
