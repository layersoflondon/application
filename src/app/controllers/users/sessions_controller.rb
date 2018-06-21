class Users::SessionsController < Devise::SessionsController

  def new
    super do
      session[:return_to] = params[:return_to]
    end
  end

  private
  def after_sign_in_path_for(user)
    return_to = session[:return_to]
    session.delete(:return_to)
    return_to || root_path
  end

end
