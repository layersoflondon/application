module ApplicationHelper

  def activestorage_url_for(resource)
    Rails.application.routes.url_helpers.polymorphic_url(resource)
  end
end
