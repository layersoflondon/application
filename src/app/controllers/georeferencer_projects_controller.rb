class GeoreferencerProjectsController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  def index
    @layers = []
    @contributors = Georeferencer::Contributor.all
    @projects = Georeferencer::Project.all
  end

  def show
    # @images = GeoreferencerImage.where(params....)
    @project = Georeferencer::Project.find(params[:id])
    raise ActionController::RoutingError, "No Georeferencer Project with slug #{params[:id]}" unless @project.present?
    @images = Georeferencer::Image.unreferenced.where(collection: @project.georeferencer_id)

  end
end
