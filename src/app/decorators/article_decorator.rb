class ArticleDecorator < Draper::Decorator
  delegate_all

  include DecoratorConcerns::BasicContent

  def day
    Date.parse(object.fields.start_date).strftime('%A')
  end

  def date
    Date.parse(object.fields.start_date).strftime('%d %B')
  end

  def year
    Date.parse(object.fields.start_date).strftime('%Y')
  end

  def full_date
    Date.parse(object.fields.start_date).strftime('%A %d %B %Y ')
  end

  def content
    if has_field?(:content, String)
      h.strip_tags(fields.content).html_safe
    end
  end

  def location
    if has_field?(:location, String)
      h.strip_tags(fields.location).html_safe
    end
  end

  def booking
    if has_field?(:booking, String)
      h.strip_tags(fields.booking).html_safe
    end
  end
end