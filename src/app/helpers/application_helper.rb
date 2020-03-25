module ApplicationHelper

  def activestorage_url_for(resource)
    Rails.application.routes.url_helpers.polymorphic_url(resource)
  end

  def layer_group_highlighted(layer_group)
    params.has_key?(:overview) ? layer_group.highlighted : false
  end
end
