class ApplicationController < ActionController::Base
  include Pundit
  protect_from_forgery with: :null_session
  after_action :verify_authorized, unless: :devise_controller?
  before_action :authenticate_user!
end

