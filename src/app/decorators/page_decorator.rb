class PageDecorator < Draper::Decorator
  include DecoratorConcerns::BasicContent
  include DecoratorConcerns::SEO
  include DecoratorConcerns::Images
  include DecoratorConcerns::HomepageCtas
  include DecoratorConcerns::HomepageSlideshow

  delegate_all

  decorates_association :sidebar_ctas, with: SidebarCtaDecorator





  # Define presentation-specific methods here. Helpers are accessed through
  # `helpers` (aka `h`). You can override attributes, for example:
  #
  #   def created_at
  #     helpers.content_tag :span, class: 'time' do
  #       object.created_at.strftime("%a %m/%d/%y")
  #     end
  #   end

end
