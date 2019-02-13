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

  def pins

  end
end