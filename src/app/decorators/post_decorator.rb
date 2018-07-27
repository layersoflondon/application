class PostDecorator < Draper::Decorator
  delegate_all

  include DecoratorConcerns::BasicContent
  include DecoratorConcerns::Images

  decorates_association :sidebar_ctas, with: SidebarCtaDecorator


  def excerpt
    if has_field?(:excerpt, String) && fields.excerpt.present?
      fields.excerpt
    else
      h.strip_tags(content.truncate(300))
    end
  end
end
