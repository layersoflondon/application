module GuideCollections
  extend ActiveSupport::Concern

  included do
    before_action :get_guides, only: :show, if: -> {@page.template.present? && @page.template.underscore.in?(["guide_list", "help_centre"])}

    decorates_assigned :guides, with: EventDecorator
  end

  def get_guides
    @georeferencer_projects = Rooftop::Guide.where(orderby: :menu_order, order: :asc)
  end

end