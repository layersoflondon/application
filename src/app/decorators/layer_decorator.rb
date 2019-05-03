class LayerDecorator < Draper::Decorator
  delegate_all

  # Define presentation-specific methods here. Helpers are accessed through
  # `helpers` (aka `h`). You can override attributes, for example:
  #
  #   def created_at
  #     helpers.content_tag :span, class: 'time' do
  #       object.created_at.strftime("%a %m/%d/%y")
  #     end
  #   end

  def name
    if short_title.present?
      short_title
    elsif title.length > Layer::MAX_SHORT_TITLE_LENGTH
      h.truncate(title, length: Layer::MAX_SHORT_TITLE_LENGTH)
    else
      title
    end
  end
end
