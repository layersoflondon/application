require 'active_storage/blob'
module ActiveStorage
  module BlobMetadata

    def self.included(base)
      base.send(:after_save, -> {
        object.copy_to(object,
                       content_type: content_type,
                       cache_control: 'public',
                       acl: 'public-read',
                       expires: Rails.configuration.x.asset_cache_expires_in.from_now.to_i,
                       content_disposition: "inline; #{filename.parameters}",
                       metadata: {'lol-id': id.to_s},
                       metadata_directive: 'REPLACE'
                       )

      })
    end

    def object
      self.class.service.bucket.object(key)
    end
  end
end