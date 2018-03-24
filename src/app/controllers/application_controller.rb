class ApplicationController < ActionController::Base
  include Pundit
  # protect_from_forgery with: :null_session
  # must be used only in specific cases, for example to allow API request (POST/PUT/PATCH/DELETE) without html form
  # With protect_from_forgery with: :null_session you must restrict access to your data
  # with an authorization system because every one could do request against your API endpoint
  # see: https://stackoverflow.com/questions/34251400/invalid-authenticity-token-on-post
  protect_from_forgery with: :null_session
  after_action :verify_authorized, unless: :devise_controller?
  before_action :authenticate_user!
end

