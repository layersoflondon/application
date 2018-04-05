if defined?(Rooftop)
  Rooftop::Rails.configure do |config|
    config.api_token = '3af7e8a8f9bf5c6c4261c23fe8155733'
    config.site_name = 'layersoflondon'
    config.perform_http_response_caching = false
    config.perform_object_caching = Rails.configuration.action_controller.perform_caching
    config.resource_route_map = {
      page: ->(path, params) {Rails.application.routes.url_helpers.page_path(path, params)}
    }
    
    config.post_type_mapping = {
      menu: Rooftop::Menus::Menu
    }
    
  end
end