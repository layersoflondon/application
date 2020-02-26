require_relative 'boot'

require 'rails/all'
require 'sprockets/es6'

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

    config.x.map_centre = {
      lat: 51.5074, lng: 0.1278
    }
    config.x.map_zoom = 10
    config.x.map_bounds = {
      south_west: {
        lat: 51.24988,
        lng: -0.55343
      },
      north_east: {
        lat: 51.72617,
        lng: 0.33233
      }
    }

    config.x.image_variants = {
      marker: {
        thumbnail: "200x200",
        combine_options: {
          gravity: "North",
          extent: "200x150",
          crop: "200x150+0+0",
          quality: 90
        }
      },
      card: {
        thumbnail: "600x600",
        combine_options: {
          gravity: "Center",
          extent: "600x280",
          crop: "600x280+0+0",
          quality: 90
        }
      },
      feature: {
        thumbnail: "500x500",
        combine_options: {
          gravity: "Center",
          extent: "466x280",
          crop: "466x280+0+0",
          quality: 90
        }
      },
      thumb: {
        thumbnail: "200x200",
        combine_options: {
          gravity: "Center",
          extent: "120x120",
          crop: "120x120+0+0",
          quality: 80
        }
      },
      primary: {
        resize: '1400x1400',
        combine_options: {
          gravity: "Center",
          extent: "1400x700",
          crop: "1400x700+0+0",
          quality: 90
        }
      },
      large: {
        combine_options: {
          resize: "1400x1400",
          quality: 95
        }
      }

    }

    config.x.asset_cache_expires_in = 2.years

    config.x.mailer_from_address = "Layers of London <layersoflondon@lon.ac.uk>"
    config.x.contact_mail_address = "layersoflondon@lon.ac.uk"
  #   600x280 tray
    # 1400x700 record hero
    # 1400x1400 large
    # 200x150 pin
    #
    config.active_job.queue_adapter     = :sidekiq

  end
end
