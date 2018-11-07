class ApplicationController < ActionController::Base
  include SimpleErrors::Rescue
  include Pundit
  if Rails.env.test?
    protect_from_forgery with: :null_session
  end
  before_action :store_current_location, unless: :should_skip_storing_location?
  after_action :verify_authorized, unless: :should_skip_verify_authorized?
  before_action :authenticate_user!, unless: :should_skip_authenticate_user?

  before_action :get_navigation_menu, if: -> {request.format.html?}

  rescue_with_not_found Rooftop::RecordNotFoundError, ActionController::RoutingError, ActiveRecord::RecordNotFound
  rescue_from Pundit::NotAuthorizedError do
    response.content_type = Mime[:html] unless request.format.json?
    render 'errors/403', layout: 'error', status: 403
  end
  rescue_from Rooftop::Rails::UnknownObjectForExpiry do; end
  before_rescue do
    get_navigation_menu
  end

  private

  def get_navigation_menu
    @main_navigation_menu, @footer_navigation_menu = *Rooftop::Menus::Menu.where(post__in: [2,3]).to_a.sort_by(&:id)
  end

  def should_skip_authenticate_user?
    devise_controller? || (controller_name == 'switch_user' && action_name == 'set_current_user')
  end

  def should_skip_verify_authorized?
    devise_controller? || is_a?(ActiveAdmin::BaseController) || (controller_name == 'switch_user' && action_name == 'set_current_user')
  end

  def should_skip_storing_location?
    devise_controller? || is_a?(ActiveAdmin::BaseController) || is_a?(PagesController)
  end

  def store_current_location
    session[:return_to] = extract_path_from_location(request.url)
  end

end
