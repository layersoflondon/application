if defined?(Rooftop)
  Rooftop::Rails.configure do |config|
    config.api_token = Rails.application.secrets.rooftop_api_key
    config.site_name = 'lol-content'
    config.perform_http_response_caching = false
    config.perform_object_caching = Rails.configuration.action_controller.perform_caching
    config.resource_route_map = {
      page: ->(path, params) {Rails.application.routes.url_helpers.page_path(path, params)}
    }
    
    config.post_type_mapping = {
      menu: Rooftop::Menus::Menu,
      attachment: Rooftop::MediaItem
    }

    # if Rails.env.development?
    #   config.ssl_options = {
    #     verify: false
    #   }
    #   config.proxy = "https://localhost:9998"
    # end

  end
end