class MapsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show state]
  skip_after_action :verify_authorized, only: %i[index show state]

  skip_before_action :get_navigation_menu

  before_action :set_state_variables
  decorates_assigned :records, with: RecordDecorator
  decorates_assigned :collections, with: CollectionDecorator

  layout 'map'

  def index
  end

  def show
  end

  def state
  end

  private
  def set_state_variables
    # @records =  RecordsIndex.filter(terms: {state: %w[published flagged]}).to_a
    @records =  RecordsIndex.filter(terms: {state: %w[published flagged]}).limit(5).order(created_at: :desc).to_a

    if user_signed_in?
      query = {
        bool: {
          should: [
            {
              terms: {
                contributor_ids: [current_user.id]
              }
            },
            {
              nested: {
                path: "owner",
                query: {
                  bool: {
                    must: [
                      {
                        match: { "owner.id" => current_user.id}
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
      @collections = CollectionsIndex.filter(query).limit(250)
    else
      @collections = CollectionsIndex.filter(terms: {state: ["published"]}).limit(5).order(created_at: :desc).to_a
    end


    @layers = LayersIndex.filter(terms: {layer_type: ["tileserver"]}).order(:date_from).limit(999)

    # return unless params[:resource].present?
    #
    # Rails.logger.info("params parsing request params #{params}")
    # @editing = params[:action_name].present? && params[:action_name] == 'edit'
    #
    # begin
    #   klass = (params[:resource].singularize.classify).constantize
    #   model = klass.find_by!(id: params[:id])
    #
    #   if model.respond_to?(:view_count)
    #     cookie_name = "viewed_#{model.class.to_s.downcase.pluralize}".to_sym
    #     model.increment!(:view_count) unless cookies[cookie_name].present? && cookies[cookie_name].include?(model.id)
    #   end
    #
    #   Rails.logger.info("params class: (#{params.inspect})   ----   #{klass}")
    # rescue => e
    #   Rails.logger.info("params error: #{e}")
    # end
    #
    # self.instance_variable_set(:"@#{params[:resource].singularize}", model.try(:decorate))
  end
end
