Rails.application.config.to_prepare do
  Rooftop::Rails::WebhooksController.send(:skip_before_action, :authenticate_user!, raise: false)
  Rooftop::Rails::WebhooksController.send(:skip_after_action, :verify_authorized, raise: false)
  Rooftop::Rails::PreviewController.send(:skip_after_action, :verify_authorized, raise: false)
end
