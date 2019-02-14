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
end