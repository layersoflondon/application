module EventCollections
  extend ActiveSupport::Concern

  included do
    before_action :get_events, only: :show, if: -> {@page.template.present?}

    decorates_assigned :events, with: EventDecorator
  end

  def get_events
    @events = Rooftop::Event.events
  end

end