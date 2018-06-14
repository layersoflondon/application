class ApplicationController < ActionController::Base
  include Pundit
  if Rails.env.test?
    protect_from_forgery with: :null_session
  end
  after_action :verify_authorized, unless: :devise_controller?
  before_action :authenticate_user!

  before_action :get_navigation_menu

  private

  def get_navigation_menu
    @main_navigation_menu, @footer_navigation_menu = *Rooftop::Menus::Menu.where(post__in: [2,3]).to_a.sort_by(&:id)
  end

end
