require 'active_storage/base_controller'
module ActiveStorage
  class AssetsController < ActiveStorage::BaseController
    skip_forgery_protection

    def show
      request.session_options[:skip] = true
      expires_in 2.years, public: true
      if key = decode_verified_key
        send_data disk_service.download(key),
                  disposition: params[:disposition], content_type: params[:content_type]
      else
        head :not_found
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

end
