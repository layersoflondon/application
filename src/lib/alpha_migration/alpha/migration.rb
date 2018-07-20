module Alpha
  class Migration

    def initialize
      # @alpha_pins = Alpha::Pin.includes(pin_content_entry: {content_entry: :content_type}).references(pin_content_entry: {content_entry: :content_type})
      @logger = Logger.new(File.join(Rails.root, 'log', 'migration.log'))
    end

    def perform!
      
    end

    def self.perform
      self.new.perform!
    end


    # private


    def migrate_users
      user_fields = Alpha::User.columns.collect(&:name) & ::User.columns.collect(&:name)
      @alpha_users = Alpha::User.all

      @alpha_users.each do |user|
        begin
          existing_user = ::User.find_by(email: user.email)
          unless existing_user.present?
            fields = user.attributes.select {|k, v| k.in?(user_fields)}
            u = ::User.new(fields)
            u.metadata[:migrated_from_alpha] = true
            u.created_at = user.created_at
            u.updated_at = user.updated_at
            u.save(validate: false)
          end
        rescue => e
          @logger.warn("User #{user.email}: #{e}")
        end

      end
    end

    def migrate_pins
      # get fields which match on both sides

      Alpha::Pin.joins(content_entry: :content_type).references(content_entry: :content_type).all.each do |pin|
        begin
          migrate_pin(pin)
          migrate_pin_url(pin)
          migrate_pin_attachment(pin)
        rescue
          next
        end
        
      end
    end

    def migrate_pin(pin)
      record_fields = Alpha::Pin.columns.collect(&:name) & ::Record.columns.collect(&:name)
      data = pin.attributes.select {|k,v| k.in?(record_fields)}
      record = Record.find_by(id: pin.id)
      unless record.present?
        begin
          r = Record.new(data.except("location"))
          r.location = {address: Geocoder.address([r.lat, r.lng])}
          r.state = "published"
          r.credit = pin.content_entry.attribution
          r.save!
        rescue => e
          @logger.warn("Pin #{pin.id} (#{pin.title}): #{e}")
        end
      end
    end

    def migrate_pin_url(pin)
      if pin.link_url.present?
        record = Record.find_by(id: pin.id)
        unless record.attachments.where(attachable_type: "Attachments::Url").any?
          record.attachments.create(attachment_type: 'url', attachable_attributes: {
            title: record.title,
            url: pin.link_url
          })
        end
      end
    end

    def migrate_pin_attachment(pin)
      content_entry = pin.content_entry
      content_type = content_entry.content_type
      record = Record.find_by(id: pin.id)
      # alpha only allowed one attachment per pin, so we can safely assume that if the record has an attachment, we can skip it (except for a url attachment).
      unless record.attachments.where.not(attachable_type: "Attachments::Url").any?
        begin
          Record.transaction do
            attachment_type = case content_type.name
                                when 'text'
                                  'document'
                                when 'audio'
                                  'audio_file'
                                else
                                  content_type.name
                              end

            # create new attachment of the correct type
            attachment = record.attachments.build(attachment_type: attachment_type, credit: content_entry.attribution, attachable_attributes: {
              title: record.title,
              caption: content_entry.content
            })
            # attachment.attachable.primary = true if attachment_type == "image"
            if content_entry.attached_file.present?
              # we need to move the file across
              attachment.attachable.file.attach(io: StringIO.new(content_entry.attached_file.file.read), filename: content_entry.file_name)
            elsif content_entry.video_url.present?
              attachment.attachable.youtube_id = YoutubeID.from(content_entry.video_url)
            end

            record.save!
            record.update_attribute(:primary_image_id, attachment.attachable.id) if attachment_type == "image"

          end
        rescue => e
          @logger.warn("Pin attachment #{content_entry.id} (#{pin.title}): #{e}")

        end
      end
    end

    def migrate_groups
      Alpha::UserGroup.all.each do |group|
        t = Team.find_or_initialize_by(id: group.id)
        t.assign_attributes(
           name: group.name,
           description: group.description
        )
        t.save
        t.leaders << ::User.find(group.primary_user_id)
        t.contributors << ::User.where(id: group.users.reject {|u| u == group.primary_user})
        t.save
      end
    end


    def migrate_collections
      Alpha::Collection.all.each do |collection|
        c = ::Collection.find_or_initialize_by(id: collection.id)
        c.update_attributes(
                      title: collection.name,
                      description: collection.description,
                      created_at: collection.created_at,
                      updated_at: collection.updated_at

        )
        if collection.user.present?
          owner = User.find(collection.user.id)
        elsif collection.user_group.present?
          owner = Team.find(collection.user_group.id)
        end
        c.update_attributes(owner: owner)
        c.records << Record.where(id: collection.pin_ids)
        c.save
      end
    end




    def log_backtrace(e)
      e.backtrace.each do |l|
        Rails.logger.debug(l)
      end
      e
    end








  end
end