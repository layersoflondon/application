class RecordReportMailer < ApplicationMailer
  before_action :add_inline_attachments!
  default from: Rails.application.config.x.mailer_from_address

  def admin_notification(report)
    @report = report
    @record = @report.record
    @email = @report.user.try(:email) || @report.email
    @reason = case @report.issue
              when 'copyright'
                "the record has copyright or attribution problems"
              when 'inaccurate'
                "the record is not accurate"
              when 'inappropriate'
                "the record is offensive or inappropriate"
              end

    mail(to: AdminUser.all.collect(&:email), subject: "Layers of London - record reported by user")
  end


  private

  def add_inline_attachments!
    attachments.inline["logo.png"] = File.read("#{Rails.root}/app/assets/images/lol-email-header.png")
  end
end
