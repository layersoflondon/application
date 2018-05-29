class PostDecorator < Draper::Decorator
  delegate_all

  include DecoratorConcerns::BasicContent

  decorates_association :post

  def title
    if has_field?(:title, String)
      h.strip_tags(fields.title).html_safe
    end
  end

  def description
    if has_field?(:description, String)
      h.strip_tags(fields.description).html_safe
    end
  end
end
