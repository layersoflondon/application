class Users::SessionsController < Devise::SessionsController
  layout 'templates/account'

  def new
    super do
      if params[:return_to].present?
        session[:return_to] = URI.parse(params[:return_to]).path
      end
      
    end
  end

  def destroy
    super do
      session[:teacher_classroom_user] = nil
      session[:teacher_classroom_user_records] = nil
    end
  end

  private
  def after_sign_in_path_for(user)
    return_to = session[:return_to]
    session.delete(:return_to)
    return_to || map_path
  end

end
