class EventsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[show]
  skip_after_action :verify_authorized, only: [:show]
  decorates_assigned :events, :event, with: EventDecorator

  def show
    @event = Rooftop::Event.where(slug: params[:id]).first
  end

end
