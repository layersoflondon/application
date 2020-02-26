url = case Rails.env
      when "development", "test"
        "redis://redis:6379/3"
      when "staging", "production"
        "redis://db01.lol:6379/3"
      end

namespace = "application_#{Rails.env}_sidekiq"

Sidekiq.configure_server do |config|
  config.redis = { url: url}
end



if defined?(PhusionPassenger)
  PhusionPassenger.on_event(:starting_worker_process) do |forked|
    Sidekiq.configure_client do |config|
      config.redis = { url: url}
    end if forked
  end
else
  Sidekiq.configure_client do |config|
    config.redis = { url: url}
  end
end