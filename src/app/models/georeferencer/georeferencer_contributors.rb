module Georeferencer
  class Contributor
    include Georeferencer::GeoreferencerConcern

    collection_path "/api/v1/contributors"

    default_scope -> {
      where(format: 'json')
    }
  end
end
