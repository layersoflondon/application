Rails.application.config.to_prepare do
  ActiveAdmin::Devise::SessionsController.send(:skip_after_action, :verify_authorized)
end
