class GuideDecorator < Draper::Decorator
  delegate_all

  include DecoratorConcerns::BasicContent
  include DecoratorConcerns::Images

end