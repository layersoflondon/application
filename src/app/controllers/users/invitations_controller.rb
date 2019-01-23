# frozen_string_literal: true

class Users::InvitationsController < Devise::InvitationsController
  layout 'templates/account'

  private

  def update_resource_params
    params.require(:user).permit(
      :first_name,
      :last_name,
      :terms_and_conditions_of_use,
      :agrees_to_marketing,
      :title,
      :invitation_token,
      :password,
      :password_confirmation)
  end

  def after_accept_path_for(user)
   resource_map_path(resource: 'account', id: 'teams')
  end


end
