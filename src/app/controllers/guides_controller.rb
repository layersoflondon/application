class GuidesController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[show]
  skip_after_action :verify_authorized, only: [:show]
  decorates_assigned :guides, :guide, with: GuideDecorator

  def show
    @guide = Rooftop::Guide.where(slug: params[:id]).first
  end
end
