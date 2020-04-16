module LayersOfLondon
  module Booth
    module MapTool
      class ApplicationController < ActionController::Base
        include Pundit

        protect_from_forgery with: :exception

        after_action :verify_authorized
        skip_after_action :verify_authorized, only: :session

        skip_before_action :authenticate_user! rescue nil
        skip_before_action :verify_authenticity_token rescue nil

        # def current_user
        #   byebug
        #   main_app.scope.request.env['warden'].user
        # end

        def session
          return render json: {} unless current_user.present?

          render json: {
            id: current_user.id,
            email: current_user.email,
            title: current_user.title,
            first_name: current_user.first_name,
            last_name: current_user.last_name,
            role: current_user.role
          }
        end
      end
    end
  end
end
