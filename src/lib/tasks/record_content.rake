namespace :record_content do
  namespace :records do
    desc "Fix plain text record content"
    task cleanup: :environment do
      records = Record.all
      plain_text_records = records.select{|r| r.description !~ /^\<p\>/}

      puts "Cleaning up #{plain_text_records.size} record description"

      plain_text_records.each do |record|
        description = ActionController::Base.helpers.simple_format(ActionController::Base.helpers.strip_tags(record.description))
        record.update_attribute(:description, description)
      end
    end
  end

  namespace :text_attachments do
    desc "Add Attachments::Text data onto record descriptions"
    task cleanup: :environment do
      text_attachments = Attachments::Text.includes(attachment: :record).all
      puts "Cleaning up #{text_attachments.size} attachments"

      text_attachments.each do |text_attachment|
        description = text_attachment.attachment.record.description
        content = ActionController::Base.helpers.simple_format(ActionController::Base.helpers.strip_tags(text_attachment.content))

        record_description = "#{description}#{content}"
        text_attachment.attachment.record.update_attribute(:description, record_description)
      end

      text_attachments.destroy_all
    end
  end
end
