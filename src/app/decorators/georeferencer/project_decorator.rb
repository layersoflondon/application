class Georeferencer::ProjectDecorator < Draper::Decorator
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

  def mappable?
    has_centroids?
    # false
  end

  def single?
    images.count == 1
  end

  def listable?
    !mappable?
  end

  def description
    h.simple_format(object.description)
  end

end
