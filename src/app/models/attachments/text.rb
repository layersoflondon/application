class Attachments::Text < ApplicationRecord
  include Attachments::SharedValidations
  has_one :attachment, as: :attachable

  def data
    {
       content: ActionController::Base.helpers.simple_format(ActionController::Base.helpers.strip_tags(content))
    }
  end

end
