class FaqDecorator < Draper::Decorator
  delegate_all

  include DecoratorConcerns::BasicContent
end