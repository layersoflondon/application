class Attachments::Text < ApplicationRecord
  include Attachments::SharedValidations

  def data
    {
       content: content
    }
  end

end
