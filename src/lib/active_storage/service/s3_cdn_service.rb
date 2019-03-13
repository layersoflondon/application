require 'active_storage/service/s3_service'
module ActiveStorage
  class Service::S3CDNService< Service::S3Service

    def url(key, expires_in:, filename:, disposition:, content_type:)
      instrument :url, key: key do |payload|
        generated_url = object_for(key).public_url(virtual_host: true).gsub('http', 'https')

        payload[:url] = generated_url

        generated_url
      end
    end

    def upload(key, io, checksum: nil, **)
      instrument :upload, key: key, checksum: checksum do
        begin
          object_for(key).put(upload_options.merge(body: io, content_md5: checksum))
        rescue Aws::S3::Errors::BadDigest
          raise ActiveStorage::IntegrityError
        end
      end
    end


  end
end