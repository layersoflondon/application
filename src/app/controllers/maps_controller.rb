class MapsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show]
  skip_after_action :verify_authorized, only: %i[index show state]

  before_action :set_state_variables

  layout 'map'

  def index
  end

  def show
  end

  def state
  end

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

      if model.respond_to?(:view_count)
        cookie_name = "viewed_#{model.class.to_s.downcase.pluralize}".to_sym
        model.increment!(:view_count) unless cookies[cookie_name].present? && cookies[cookie_name].include?(model.id)
      end

      Rails.logger.info("params class: (#{params.inspect})   ----   #{klass}")
    rescue => e
      Rails.logger.info("params error: #{e}")
    end

    self.instance_variable_set(:"@#{params[:resource].singularize}", model.try(:decorate))
  end
end
