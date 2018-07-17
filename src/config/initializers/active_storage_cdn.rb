Rails.application.config.to_prepare do
  # Although private, the cache control on the asset redirection will last in the browser for 2 weeks.
  ActiveStorage::Blob.service.url_expires_in = 5.minutes
  ActiveStorage::Blob.include(ActiveStorage::BlobMetadata)
  ActiveStorage::Variant.prepend(ActiveStorage::VariantMetadata)
end

