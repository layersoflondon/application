class ApplicationController < ActionController::Base
  include Pundit
  after_action :verify_authorized, unless: :devise_controller?
  before_action :authenticate_user!
end
