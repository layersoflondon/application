class SidebarCtaDecorator < Draper::Decorator
  delegate_all

  

  # Define presentation-specific methods here. Helpers are accessed through
  # `helpers` (aka `h`). You can override attributes, for example:
  #
  #   def created_at
  #     helpers.content_tag :span, class: 'time' do
  #       object.created_at.strftime("%a %m/%d/%y")
  #     end
  #   end
  #
  def title
    h.strip_tags(object.title).html_safe
  end

  def subtitle
    h.strip_tags(object.fields.subtitle).html_safe
  end

  def content
    h.strip_tags(object.fields.cta_content).html_safe
  end

  def url
    if has_field?(:link_to_url_elsewhere, TrueClass)
      object.fields.url
    else
      h.page_path(object.fields.page.first.nested_path)
    end
  end

end
