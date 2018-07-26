class CustomDeviseMailer < Devise::Mailer
  layout 'mailer'
  before_action :add_inline_attachments!
  default from: Rails.application.config.x.mailer_from_address

  private

  def add_inline_attachments!
    attachments.inline["logo.png"] = File.read("#{Rails.root}/app/assets/images/lol-email-header.png")
  end
end