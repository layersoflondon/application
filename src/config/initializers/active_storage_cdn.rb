# See https://github.com/rails/rails/issues/31419#issuecomment-370900013
Rails.application.config.to_prepare do
  if defined?(ActiveStorage::Service::S3Service)
    # Make ActiveStorage as public-read. @dinatih
    ActiveStorage::Service::S3Service.class_eval do
      def upload(key, io, checksum: nil)
        instrument :upload, key: key, checksum: checksum do
          begin
            object_for(key)
              .put(upload_options.merge(body: io, content_md5: checksum, acl: 'public-read'))
          rescue Aws::S3::Errors::BadDigest
            raise ActiveStorage::IntegrityError
          end
        end
      end

      def cdn_host
        "assets-#{Rails.env}.layersoflondon.org"
      end

      def proxy_url(url)
        return url unless cdn_host
        uri = URI(url)
        uri.host = cdn_host
        uri.path.gsub!("/#{bucket.name}","")
        uri.to_s
      end

      def url(key, expires_in:, filename:, disposition:, content_type:)
        instrument :url, key: key do |payload|
          generated_url = proxy_url object_for(key).public_url
          payload[:url] = generated_url
          generated_url
        end
      end
    end
  end
end