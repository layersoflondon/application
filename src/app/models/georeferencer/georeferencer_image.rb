module Georeferencer
  class Image
    include Georeferencer::GeoreferencerConcern

    collection_path "/api/v1/display"
    resource_path "/api/v1/maps/:id"

    default_scope -> {
      where(format: 'json')
    }

    scope :unreferenced, -> {
      where(state: 'waiting')
    }

    def fetch_details!
      Rails.cache.fetch "georeferencer_image_#{id}" do
        self.class.find(id)
      end
    end

    def centroid
      details = fetch_details!
      (wlng, slat, elng, nlat) = details.bbox
      {lat: (slat+nlat)/2, lng: (wlng+elng)/2}
    end
  end
end
