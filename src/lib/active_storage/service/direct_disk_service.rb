require 'active_storage/service/disk_service'
module ActiveStorage
  class Service::DirectDiskService < Service::DiskService



    def url(key, expires_in:, filename:, disposition:, content_type:)
      instrument :url, key: key do |payload|
        verified_key_with_expiration = ActiveStorage.verifier.generate(key, expires_in: nil, purpose: :blob_key)

        generated_url =
          url_helpers.asset_url(
            verified_key_with_expiration,
            host: current_host,
            filename: filename,
            disposition: content_disposition_with(type: disposition, filename: filename),
            content_type: content_type
          )

        payload[:url] = generated_url

        generated_url
      end
    end
  end
end