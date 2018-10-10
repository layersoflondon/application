Rails.application.configure do
    config.webpacker.check_yarn_integrity = false  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  config.action_controller.perform_caching = true

  config.cache_store = config.cache_store = :redis_store, 'redis://redis:6379/0/cache'
    
  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :amazon

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.perform_caching = false

  # Sending emails
  config.action_mailer.smtp_settings = {
      address: 'mail',
      port: 2525
  }
  config.action_mailer.default_url_options = {
      host: 'localhost',
      port: 3000
  }
  config.action_mailer.default_options = {
      from: Rails.configuration.x.mailer_from_address,
      reply: Rails.configuration.x.mailer_from_address
  }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  # config.file_watcher = ActiveSupport::EventedFileUpdateChecker
  config.file_watcher = ActiveSupport::FileUpdateChecker

  config.after_initialize do
    Bullet.enable = true
    Bullet.bullet_logger = true
  end


end
Rails.application.routes.default_url_options[:host] = 'localhost:3000'
