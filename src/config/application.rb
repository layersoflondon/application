require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module LayersApp
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
    config.autoload_paths += [Rails.root.join('lib/alpha_migration'), Rails.root.join('lib/active_storage')]
    config.eager_load_paths += [Rails.root.join('lib/alpha_migration'), Rails.root.join('lib/active_storage')]

    config.x.image_variants = {
      thumb: {
        resize: "200x200"
      },
      small: {
        resize: "600x600"
      },
      large: {
        resize: "1200x1200"
      }
    }

  end
end
