require 'csv'
namespace :import do
  namespace :datasets do
    desc "Import LMA health and welfare records and associated images"
    task :lma_health, [:excel_file, :images_path] => :environment do |t, args|
      unless args[:excel_file].present? && args[:images_path].present?
        puts <<~EOM
          You need to pass 2 args into this importer: excel file, images path to associate the records to like this:

          rake import:datasets:lma_housing[excel_file.xlsx,./images]
                
          Paths can be relative. Note, no spaces between args, just commas
        EOM
      end

      # parse the excel file.
      workbook = RubyXL::Parser.parse(File.expand_path(args[:excel_file]))
      data = workbook[0]
      images = workbook[1]
      data_rows = data.collect {|row| row && row.cells.collect {|c| c.try(:value)}}.reject{|r| r.all?(nil)}
      image_rows = images.collect {|row| row && row.cells.collect {|c| c.try(:value)}}
      headers = data_rows[0]

      # Create or get the user
      user = User.find_by(email: 'jane.muncaster@cityoflondon.gov.uk')

      #   Create the team
      team = Team.find_or_create_by(name: "London Metropolitan Archives")
      team.leaders << user unless team.leader_users.include?(user)

      #   Find or create the collection
      #
      collection = team.collections.find_or_initialize_by(title: "Housing London: London County Council Collections")
      # set read state and write state
      collection.public_read!
      collection.team!
      collection_description = <<~EOM
        London's Health and Welfare is one of several collections curated by the Layers of London team at London Metropolitan Archives (LMA). These collections bring together photographs, films and estate plans from the London County Council archive collection at LMA.
 
        This collection features 120 photographs which include hospitals, health centres, dispensaries, workhouse institutions, maternity homes and therapy departments. These services were established or maintained by London County Council Public Health Department after the passing of the 1929 Local Government Act. At this time, the council took on the duties of the Metropolitan Asylums Board and twenty-five Boards of Guardians of the Poor to become the overall commissioning and management body for London’s health and welfare services. It remained so until the establishment of the National Health Service in 1948. The photographs in this collection illustrate the bold and forward-looking strategy which the LCC adopted as it sought to improve the health and well-being of all Londoners.   
        
        <h3>About the London County Council (LCC)</h3>
        From 1889 to 1965, the London County Council (LCC) was the top-level authority for the metropolitan boroughs of the County of London. As the most important elected authority in the country, the LCC co-ordinated, funded and directly provided a staggering range of services to people who lived in London and to the many millions who passed through the capital for work or pleasure. 

        The London County Council collection is held at London Metropolitan Archives: <a href="https://search.lma.gov.uk/scripts/mwimain.dll/144/LMA_OPAC/web_detail/REFD+LCC?SESSIONSEARCH">Collection Catalogue</a>.


        <h3>References and sources</h3>
        'The LCC Hospitals: a retrospect.’ Published by London County Council, 1949.

        'Fifty Years of the LCC’ by S. P. B. Mais, published by Cambridge University press, 1939. 

        'Achievement: a short history of the LCC’ by W. Eric Jackson, published by Longman, 1965.

        'The development of the London hospital system, 1823 – 1982’ by Geoffrey Rivett, published by King Edward’s Hospital Fund for London, 1986. 

        'An index of London hospitals and their records’ by Cliff Webb, published by Society of Genealogists Enterprises Ltd, 2002.
      EOM
      collection.description = ActionController::Base.helpers.simple_format(ActionController::Base.helpers.sanitize(collection_description, tags: ['a', 'h3']))
      collection.save

      # the headers are as follows:
      # ["No. ", "Collage Record No.", "Metropolitan Borough (pre-1965)", "Title", "Description", "Extra links (hyperlink underlined in text)", "Estate name link to image group search on COLLAGE", "Image (Content) Date", "COLLAGE link", "Catalogue No. (HIDE) ", "Geo-location (lat)", "Geo-location (long)", "LMA Website Link ", "Text for LMA Website Link"]
      # 
      data_rows[1..-1].each do |row|
        number, catalogue_number, collage_id, lat, lng, date, created_by, title, description, image_collage_link, image_collage_link_title, collage_search_link, collage_search_link_more_title, extra_link_1, extra_link_1_title, extra_link_2, extra_link_2_title, extra_link_3, extra_link_3_title, lma_link, lma_link_title, sources_1, sources_2, sources_3 = *row
        # pull out the string portion of a date
        date = date.to_s.match(/\d+/).try(:[], 0)
        next unless date.present?

        lat = lat.to_s.strip().gsub(/[[:space:]]/,'').to_f
        lng = lng.to_s.strip().gsub(/(,|[[:space:]])/, '').to_f
        next if lat === 0.0 || lng === 0.0

        puts "Importing #{title}"

        begin
          title = ActionController::Base.helpers.strip_tags(title)
          next if collection.records.find_by(title: title).present?

          record_description = ActionController::Base.helpers.simple_format(ActionController::Base.helpers.strip_tags(description))

          record_credit = <<~EOM
#{[sources_1, sources_2, sources_3].join("\n")}
          EOM

          record = Record.new({
                                state: "published",
                                title: ActionController::Base.helpers.strip_tags(title),
                                description: record_description,
                                lat: lat,
                                lng: lng,
                                credit: ActionController::Base.helpers.simple_format(record_credit),
                                date_from: Date.parse("#{date}-01-01"),
                                autogenerated_date_from_fields: [:date, :month],
                                user: user
                              })


          image = record.attachments.build(attachment_type: 'image', credit: 'London Metropolitan Archives (City of London Corporation)', attachable_attributes: {
            title: record.title
          })
          file_path = File.join(File.expand_path(args[:images_path]), "London Met Archives #{catalogue_number}.jpg")
          image.attachable.file.attach(io: StringIO.new(File.open(file_path).read), filename: "London Met Archives #{catalogue_number}.jpg")
          image.attachable.caption = ""
          record.save!
          record.update_attribute(:primary_image_id, image.attachable.id)

          if image_collage_link.present?
            record.attachments.create(attachment_type: 'url', attachable_attributes: {
                title: (image_collage_link_title || image_collage_link).strip,
                url: image_collage_link.strip
            })
          end

          if collage_search_link.present?
            record.attachments.create(attachment_type: 'url', attachable_attributes: {
                title: (collage_search_link_more_title || collage_search_link).strip,
                url: collage_search_link.strip
            })
          end

          extra_links = [extra_link_1, extra_link_1_title, extra_link_2, extra_link_2_title, extra_link_3, extra_link_3_title].each_slice(2).to_a.reject{|el| el.all?(nil)}
          extra_links.each do |link, title|
            if link.match(/youtube/i)
              #   we're creating a video attachment
              video = record.attachments.build(attachment_type: 'video', credit: "", attachable_attributes: {
                title: record.title
              })
              video.attachable.youtube_id = YoutubeID.from(link)
            else
              #   we're creating a normal link
              record.attachments.create(attachment_type: 'url', attachable_attributes: {
                title: (title || link),
                url: link
              })
            end
          end if extra_links.any?

          if lma_link.present? && lma_link_title.present?
            record.attachments.create(attachment_type: 'url', attachable_attributes: {
              title: lma_link_title.strip,
              url: lma_link.strip
            })
          end

          unless collection.records.include?(record)
            CollectionRecord.create(collection_id: collection.id, record_id: record.id, contributing_user_id: user.id)
          end

          record.save!

        rescue => e
          puts e
          next
        end
      end

      collection.save!
    end
  end
end
