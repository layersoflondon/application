class FeaturedItemDecorator < Draper::Decorator
  include DecoratorConcerns::PlaceholderClass
  delegate_all

  def has_image?
    object.image.present?
  end

  def image
    has_image? ? object.image['feature'] : ""
  end

  def title
    h.strip_tags(object.title).html_safe
  end
  
  def description
    h.strip_tags(object.description || "").truncate(400).html_safe
  end

  def path
    if object.item_type.downcase === 'record'
      "/map?record=#{object.item_id}"
    else
      h.resource_map_path(resource: object.item_type.downcase.pluralize, id: object.item_id)
    end
  end
end
