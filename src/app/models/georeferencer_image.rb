class GeoreferencerImage
  include Her::Model

  collection_path "/api/v1/display"
  resource_path "/api/v1/maps/:id"

  default_scope -> {
    where(format: 'json')
  }

  scope :unreferenced, -> {
    where(state: 'waiting')
  }

  def self.all!
    batch = GeoreferencerImage.all.fetch
    images = [batch.to_a]
    loop do
      start = nil

      if batch.metadata.present?
        start = batch.metadata[:start]
      else
        break
      end

      batch = GeoreferencerImage.where(start: start).fetch
      images.push batch
    end

    images.flatten
  end

  def cache_key

  end

  def fetch_details!
    Rails.cache.fetch "georeferencer_image_#{id}" do
      GeoreferencerImage.find(id)
    end
  end

  def centroid
    details = fetch_details!
    (wlng, slat, elng, nlat) = details.bbox
    {lat: (slat+nlat)/2, lng: (wlng+elng)/2}
  end
end
