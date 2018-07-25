class CustomDeviseMailer < Devise::Mailer
  layout 'mailer'
  before_action :add_inline_attachments!

  private

  def add_inline_attachments!
    attachments.inline["logo.png"] = File.read("#{Rails.root}/app/assets/images/lol-email-header.png")
  end
end