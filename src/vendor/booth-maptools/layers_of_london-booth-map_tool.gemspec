$:.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "layers_of_london/booth/map_tool/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |spec|
  spec.name        = "layers_of_london-booth-map_tool"
  spec.version     = LayersOfLondon::Booth::MapTool::VERSION
  spec.authors     = ["Paul Hendrick"]
  spec.email       = ["paul@error.agency"]
  spec.homepage    = "https://layersoflondon.org"
  spec.summary     = "Booth poverty map tool API for Layers Of London"
  spec.description = "Booth poverty map tool API for Layers Of London"
  spec.license     = "GPL-3.0"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  # if spec.respond_to?(:metadata)
  #   spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"
  # else
  #   raise "RubyGems 2.0 or newer is required to protect against " \
  #     "public gem pushes."
  # end

  spec.files = Dir["{app,config,db,lib}/**/*", "LICENSE", "Rakefile", "README.md"]

  spec.add_dependency "rails", "~> 5.2"
  spec.add_dependency "pundit", "~> 2.0"
  spec.add_dependency "aasm", "~> 5.0"
  spec.add_dependency 'geokit'
  spec.add_development_dependency "sqlite3", "~> 1.0"

end
