Georeferencer.configure do |config|
  # if Rails.env.development?
    # config.proxy = "https://localhost:9998"
    # config.ssl_options = {
    #   verify: false
    # }
  # end
  config.subdomain = 'layersoflondon'
end