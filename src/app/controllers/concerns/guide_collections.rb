module GuideCollections
  extend ActiveSupport::Concern

  included do
    before_action :get_guides, only: :show, if: -> {@page.template.present?}

    decorates_assigned :guides, with: EventDecorator
  end

  def get_guides
    @guides = Rooftop::Guide.guides
  end

end