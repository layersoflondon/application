module Alpha
  class Migration

    def initialize
      # @alpha_pins = Alpha::Pin.includes(pin_content_entry: {content_entry: :content_type}).references(pin_content_entry: {content_entry: :content_type})

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
            u.save(validate: false)
          end
        rescue => e
          Rails.logger.debug("Couldn't migrate user #{user.email}: #{e}")
          log_backtrace(e)
        end

      end
    end

    def migrate_groups
      # todo - don't appear to *be* any groups in use
    end

    def migrate_pins
      # get fields which match on both sides
      record_fields = Alpha::Pin.columns.collect(&:name) & ::Record.columns.collect(&:name)
      Alpha::Pin.all.each do |pin|
        data = pin.attributes.select {|k,v| k.in?(record_fields)}
        record = Record.find_by(id: pin.id)
        unless record.present?
          begin
            r = Record.new(data.except("location"))
            r.location = {address: data["location"]}
            r.save!
          rescue => e
            Rails.logger.debug("Couldn't migrate pin #{pin.title}: #{e}")
            log_backtrace(e)
          end
        end
      end
    end

    def migrate_collections
      Alpha::Collection.all.each do |collection|
        ::Collection.create(
                      title: collection.name,
                      description: collection.description,
                      created_at: collection.created_at,
                      updated_at: collection.updated_at
        )
      end
    end


    def log_backtrace(e)
      e.backtrace.each do |l|
        Rails.logger.debug(l)
      end
    end








  end
end