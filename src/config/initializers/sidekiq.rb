url = case Rails.env
      when "development", "test"
        "redis://redis:6379/0"
      when "staging", "production"
        "redis://db01.lol:6379/0"
      end

Sidekiq.configure_server do |config|
  config.redis = { url: url }
end

Sidekiq.configure_client do |config|
  config.redis = { url: url }
end