class StagingEmailInterceptor
  def self.delivering_email(message)
    message.to = ['ed+test-lol-staging@error.agency']
  end
end

unless Rails.env.production?
  ActionMailer::Base.register_interceptor(StagingEmailInterceptor)
end
