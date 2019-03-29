class GeoreferencerProjectsController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  decorates_assigned :project, with: Georeferencer::ProjectDecorator

  layout 'templates/georeferencer_project_detail'

  def show
    # @images = GeoreferencerImage.where(params....)
    @project = Georeferencer::Project.find(params[:id])
    raise ActionController::RoutingError, "No Georeferencer Project with slug #{params[:id]}" unless @project.present?
    @progress = Rails.cache.fetch(@project.progress_cache_key) do
      @project.progress
    end
    respond_to do |format|
      format.html
      format.json  do

        @images = Rails.cache.fetch(@project.images_cache_key) do
          @project.images
        end
      end
    end


  end
end
