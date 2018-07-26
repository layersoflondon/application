class PostDecorator < Draper::Decorator
  delegate_all

  include DecoratorConcerns::BasicContent


  def excerpt
    if has_field?(:excerpt, String) && fields.excerpt.present?
      fields.excerpt
    else
      content.truncate(100)
    end
  end
end
