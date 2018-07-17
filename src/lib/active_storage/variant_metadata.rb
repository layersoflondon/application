module ActiveStorage
  module VariantMetadata

    def upload(image)
      File.open(image.path, "r") do |file|
        service.upload(key, file)
        object = service.bucket.object(key)
        object.copy_to(object,
                       content_type: content_type,
                       cache_control: 'public',
                       acl: 'public-read',
                       expires: Rails.configuration.x.asset_cache_expires_in.from_now.to_i,
                       content_disposition: "inline; #{filename.parameters}",
                       metadata: {'lol-id': blob.id.to_s},
                       metadata_directive: 'REPLACE'
        )
      end

    end
  end
end