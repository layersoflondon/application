class ApplicationController < ActionController::Base
  include Pundit
  if Rails.env.test?
    protect_from_forgery with: :null_session
  end
  after_action :verify_authorized, unless: :devise_controller?
  before_action :authenticate_user!
end
