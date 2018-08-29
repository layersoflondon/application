module ApplicationHelper

  def activestorage_url_for(resource)
    Rails.application.routes.url_helpers.polymorphic_url(resource)
  end

  def placeholder_image
    url = image_url("placeholder/wide-%02d.svg" % rand(1..10))
    Rails.configuration.x.image_variants.keys.collect(&:to_s).inject({}) {|h, k| h[k] = url; h}
  end
end
