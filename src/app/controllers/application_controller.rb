class ApplicationController < ActionController::Base
  include Pundit
  if Rails.env.test?
    protect_from_forgery with: :null_session
  end
  before_action :store_current_location, unless: :should_skip_storing_location?
  after_action :verify_authorized, unless: :should_skip_verify_authorized?
  before_action :authenticate_user!

  before_action :get_navigation_menu

  private

  def get_navigation_menu
    @main_navigation_menu, @footer_navigation_menu = *Rooftop::Menus::Menu.where(post__in: [2,3]).to_a.sort_by(&:id)
  end

  def should_skip_verify_authorized?
    devise_controller? || is_a?(ActiveAdmin::BaseController)
  end

  def should_skip_storing_location?
    devise_controller? || is_a?(ActiveAdmin::BaseController) || is_a?(PagesController)
  end

  def store_current_location
    session[:return_to] = extract_path_from_location(request.url)
  end

end
