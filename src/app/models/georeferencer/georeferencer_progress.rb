module Georeferencer
  class Progress
    include Georeferencer::GeoreferencerConcern

    collection_path "/api/v1/progress"
    resource_path "/api/v1/progress?collection=:id"

    default_scope -> {
      where(format: 'json')
    }

    def self.all
      raise NoMethodError, "Use #find(project_name)"
    end
  end
end
