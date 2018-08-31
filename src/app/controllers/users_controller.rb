class UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[show]
  skip_after_action :verify_authorized, only: [:show]
  decorates_assigned :user, with: UserDecorator
  def show
    @user = User.find(params[:id])
  end
end
