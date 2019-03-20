class GeoreferencerProjectsController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  decorates_assigned :project, with: Georeferencer::ProjectDecorator

  layout 'templates/georeferencer_project_detail'

  def show
    # @images = GeoreferencerImage.where(params....)
    @project = Georeferencer::Project.find(params[:id])
    raise ActionController::RoutingError, "No Georeferencer Project with slug #{params[:id]}" unless @project.present?
    @progress = Georeferencer::Progress.find(@project.georeferencer_id)
    respond_to do |format|
      format.html
      format.json  do
        @images = @project.images.unreferenced.fetch
      end
    end


  end
end
