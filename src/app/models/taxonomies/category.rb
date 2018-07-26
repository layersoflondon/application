module Taxonomies
  class Category
    include Rooftop::Post
    self.api_endpoint = "categories"

    def self.all
      super.sort_by {|term| term.name}
    end

    def self.find_by_slug(slug)
      all.find do |cat|
        cat.slug == slug
      end
    end
  end
end
