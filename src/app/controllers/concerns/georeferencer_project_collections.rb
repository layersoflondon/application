module GeoreferencerProjectCollections
  extend ActiveSupport::Concern

  included do
    before_action :get_georeferencer_projects, only: :show, if: -> {@page.template.present? && @page.template.underscore.in?(["georeferencer_project_list"])}

    decorates_assigned :projects, with: Georeferencer::ProjectDecorator
    decorates_assigned :contributors, with: Georeferencer::ContributorDecorator
  end

  def get_georeferencer_projects
    @contributors = Georeferencer::Contributor.all
    @projects = Georeferencer::Project.where(show_on_website: true)
  end
end