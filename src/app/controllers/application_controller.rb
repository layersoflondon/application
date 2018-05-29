class ApplicationController < ActionController::Base
  include Pundit
  if Rails.env.test?
    protect_from_forgery with: :null_session
  end
  after_action :verify_authorized, unless: :devise_controller?
  before_action :authenticate_user!

  before_action :set_state_variables, if: -> {controller_name == 'maps' && action_name == 'show'}
  before_action :get_navigation_menu

  private
  def set_state_variables
    @records = Record.published.limit(2).decorate
    @collections = Collection.collections_for_user(current_user).limit(2).decorate

    return unless params[:resource].present?

    Rails.logger.info("params parsing request params #{params}")
    @editing = params[:action_name].present? && params[:action_name] == 'edit'

    begin
      klass = (params[:resource].singularize.classify).constantize
      model = klass.find_by!(id: params[:id])

      Rails.logger.info("params class: (#{params.inspect})   ----   #{klass}")
    rescue => e
      Rails.logger.info("params error: #{e}")
    end

    self.instance_variable_set(:"@#{params[:resource].singularize}", model.try(:decorate))
  end

  def get_navigation_menu
    @main_navigation_menu, @footer_navigation_menu, @sub_navigation_menu = *Rooftop::Menus::Menu.where(post__in: [2,3,4]).to_a.sort_by(&:id)
  end

end

