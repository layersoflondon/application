class TagGroupsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index]
  
  def index
    @tag_groups = TagGroupPolicy::Scope.new(current_user, TagGroupsIndex).resolve
    authorize @tag_groups
  end

  def show
    slug = params[:id]
    @tag_group = TagGroupsIndex.query {match(slug: slug)}.first
    authorize @tag_group
  end
end
