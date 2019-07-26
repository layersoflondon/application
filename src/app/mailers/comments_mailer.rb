class CommentsMailer < ApplicationMailer
  before_action :add_inline_attachments!
  default from: Rails.application.config.x.mailer_from_address


  def owner_comment_notification(comment)
    @comment = comment
    @record = comment.record
    @user = @record.user
    mail(to: @user.email, subject: "Layers of London - new comment on your record")
  end

  def reply_notification(comment, recipient)
    @comment = comment
    @record = comment.record
    @user = comment.user
    @recipient = recipient
    mail(to: @recipient.email, subject: "Layers of London - new reply to your comment")

  end


  private

  def add_inline_attachments!
    attachments.inline["logo.png"] = File.read("#{Rails.root}/app/assets/images/lol-email-header.png")
  end
end
