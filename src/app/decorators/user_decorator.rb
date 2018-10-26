class UserDecorator < Draper::Decorator
  delegate_all

  # Define presentation-specific methods here. Helpers are accessed through
  # `helpers` (aka `h`). You can override attributes, for example:
  #
  #   def created_at
  #     helpers.content_tag :span, class: 'time' do
  #       object.created_at.strftime("%a %m/%d/%y")
  #     end
  #   end

  def teacher_name
    return name unless teacher?

    prefix = user.title

    if prefix
      "#{User.titles[prefix]} #{last_name}"
    else
      name
    end
  end
end
