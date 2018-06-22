# frozen_string_literal: true

class Users::InvitationsController < Devise::InvitationsController
  layout 'iframe'
end
