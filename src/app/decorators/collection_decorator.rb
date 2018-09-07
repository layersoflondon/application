class CollectionDecorator < Draper::Decorator
  include DecoratorConcerns::PlaceholderClass
  delegate_all
  decorates_association :records

  # Define presentation-specific methods here. Helpers are accessed through
  # `helpers` (aka `h`). You can override attributes, for example:
  #
  #   def created_at
  #     helpers.content_tag :span, class: 'time' do
  #       object.created_at.strftime("%a %m/%d/%y")
  #     end
  #   end

  def description
    h.simple_format(h.sanitize(object.description, tags: ['br']))
  end
end
