require 'active_storage/base_controller'
class AssetsController < ActiveStorage::BaseController
  skip_forgery_protection

  def show
    request.session_options[:skip] = true
    http_cache_forever(public: true) do
      if key = decode_verified_key
        send_data disk_service.download(key),
                  disposition: params[:disposition], content_type: params[:content_type]
      else
        head :not_found
      end
    end
  end

  private
  def disk_service
    ActiveStorage::Blob.service
  end


  def decode_verified_key
    ActiveStorage.verifier.verified(params[:encoded_key], purpose: :blob_key)
  end


end
