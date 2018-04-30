class UserController < ApplicationController
  layout 'iframe', only: [:record_collections]

  def record_collections
    authorize(current_user)
  end
end
