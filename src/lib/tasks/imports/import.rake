require 'csv'
namespace :import do
  namespace :datasets do
    desc "Import LMA health and welfare records and associated images"
    task :generic, [:excel_file, :images_path, :yaml_path] => :environment do |t, args|
      unless args[:excel_file].present? && args[:images_path].present?
        puts <<~EOM
          You need to pass 3 args into this importer: excel file, images path to associate the records to, and the yaml mapping...like this:

          rake import:datasets:lma_housing[excel_file.xlsx,./images]
                
          Paths can be relative. Note, no spaces between args, just commas
        EOM
      end

      # load the yaml mapping for the import
      yaml = YAML.load(open(File.expand_path(args[:yaml_path]))).with_indifferent_access

      # parse the excel file.
      workbook = RubyXL::Parser.parse(File.expand_path(args[:excel_file]))
      data = workbook[0]
      data_rows = data.collect {|row| row && row.cells.collect {|c| c.try(:value)}}.reject{|r| r.all?(nil)}

      # Create or get the user
      user = User.find_by(email: 'jane.muncaster@cityoflondon.gov.uk')

      #   Create the team
      team = Team.find_or_create_by(yaml[:find][:team])
      team.leaders << user unless team.leader_users.include?(user)

      #   Find or create the collection
      #
      collection = team.collections.find_or_initialize_by(yaml[:find][:collection])

      collection_description = <<~EOM
        #{yaml[:import][:collection_description]}
      EOM

      collection.description = ActionController::Base.helpers.simple_format(ActionController::Base.helpers.sanitize(collection_description, tags: ['a', 'h3'])) unless collection.persisted?

      # set read state and write state
      collection.public_read!
      collection.team!
      collection.save

      row_indices = yaml[:import][:rows_indices] || [1, -1]

      data_rows[row_indices[0]..row_indices[1]].each_with_index do |row, row_index|
        yaml[:import][:row_attributes].each_with_index do |column, i|
          instance_variable_set("@#{column}", row[i])
        end

        unless defined?(@date)
          puts "Row #{row_index+1} No date defined"
          next
        end

        @date = @date.to_s.match(/\d+/).try(:[], 0)
        @lat = @lat.to_s.strip().gsub(/[[:space:]]/,'').to_f
        @lng = @lng.to_s.strip().gsub(/(,|[[:space:]])/, '').to_f

        if @lat === 0.0 || @lng === 0.0
          puts "Row #{row_index+1} No lat/lng defined"
          next
        end

        begin
          @title = ActionController::Base.helpers.strip_tags(@title)
          next if collection.records.find_by(title: @title).present?

          puts "Importing #{@title}."

          if yaml[:import].try(:[], :credit_attribute)
            credit = instance_variable_get("@#{yaml[:import][:credit_attribute]}") || ""
          else
            credit = "London Metropolitan Archives (City of London Corporation): https://www.cityoflondon.gov.uk/things-to-do/london-metropolitan-archives/Pages/default.aspx"
          end

          if yaml[:import].has_key?(:default_values) && yaml[:import][:default_values].try(:[], :record).any?
            yaml[:import][:default_values][:record].each do |attribute_name, sub_attributes_for_value|
              current_attribute_value = instance_variable_get("@#{attribute_name}")
              instance_variable_set("@#{attribute_name}", sub_attributes_for_value.collect{|a| instance_variable_get("@#{a}")}.join(', ')) unless current_attribute_value.present?
            end
          end

          record = Record.new({
            state: "published",
            title: ActionController::Base.helpers.strip_tags(@title),
            description: ActionController::Base.helpers.simple_format(ActionController::Base.helpers.strip_tags(@description)),
            lat: @lat,
            lng: @lng,
            credit: ActionController::Base.helpers.simple_format(credit),
            date_from: Date.parse("#{@date}-01-01"),
            autogenerated_date_from_fields: [:date, :month],
            user: user
          })

          image_filename_prefix = "#{yaml[:import].try(:[], :image_filename_prefix)} " || ""

          file_path = File.join(File.expand_path(args[:images_path]), "#{image_filename_prefix}#{@catalogue_number}.jpg")
          if File.exists?(file_path)
            image = record.attachments.build(attachment_type: 'image', credit: 'London Metropolitan Archives (City of London Corporation)', attachable_attributes: {
                title: record.title
            })

            image.attachable.file.attach(io: StringIO.new(File.open(file_path).read), filename: "#{@catalogue_number}.jpg")
            image.attachable.caption = ""
            record.save!
            record.update_attribute(:primary_image_id, image.attachable.id)
          end

          if yaml[:import].try(:[], :extra_link_attributes).try(:any?)
            extra_links = yaml[:import][:extra_link_attributes].select{|attr| instance_variable_get("@#{attr}")}.collect{|attr| [instance_variable_get("@#{attr}"), instance_variable_get("@#{attr}_title")]}

            extra_links.each do |link, title|
              if link.match(/youtube/i)
                link = record.attachments.build(attachment_type: 'video', credit: '', attachable_attributes: {
                    title: record.title
                })

                link.attachable.youtube_id = YoutubeID.from(link)
              else
                record.attachments.build(attachment_type: 'url', credit: '', attachable_attributes: {
                    title: (title || link),
                    url: link.strip
                })
              end
            end if extra_links.any?
          end

          record.save!

          unless collection.records.include?(record)
            # puts "Adding record #{record.title} to collection #{collection.title}"
            CollectionRecord.create(collection_id: collection.id, record_id: record.id, contributing_user_id: user.id)
          end

          collection.reload.save
        rescue => e
          puts e
          next
        end
      end
    end
  end
end
