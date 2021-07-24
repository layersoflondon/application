module HumapMigration
  class RecordExporter
    RECORDS = Record.includes(:user, :attachments, :tag_groups, :tags).preload(attachments: :attachable, collections: :owner)

    def self.export!(dir = nil)
      self.new.export!(dir)
    end

    def export!(dir = nil)
      count = RECORDS.count
      folder = dir ? File.expand_path(dir) : Rails.root.join("export")
      puts "Exporting to #{folder}"
      RECORDS.all.each_with_index do |record, i|
        print "\r #{i + 1} / #{count}"
        FileUtils.mkdir_p(folder)
        file = File.join(folder, "#{record.id}.json")
        File.open(file, "w+") { |f| f.write data_for(record).to_json }
      end
    end

    def data_for(record)
      data = record.attributes.except(:description).merge({
                                                            user: record.user.attributes.except(:primary_image),
                                                            image: record.primary_image.try(:data).try(:dig, *[:title, :url, :credit, :caption])
                                                          })
      data.merge!({
                    description: CGI.escape_html(record.description)
                  })

      [:url, :image, :audio_file, :dataset, :document, :url].each do |scope|
        data.merge!({
                      # scope.to_s.pluralize.to_sym => record.attachments.send(scope).collect(&:attachable).collect {|a| a.data.dig(:title, :url, :credit, :caption)}.compact
                      scope.to_s.pluralize.to_sym => record.attachments.send(scope).collect(&:attachable).inject([]) do |array, attachable|
                        array << {
                          title: attachable.title,
                          caption: attachable.caption,
                          credit: attachable.credit,
                          url: attachable.try(:file).try(:service_url) || attachable.try(:url)
                        }
                      end


                    })
      end

      data.merge!({
                    videos: record.attachments.video.collect(&:attachable).collect { |v| {title: v.title, youtube_id: v.youtube_id, caption: v.caption, credit: v.credit} }.compact
                  })

      data.merge!({
                    tags: record.tags.includes(:tag_group).references(:tag_group).collect { |t| {name: t.name, tag_group: t.tag_group.name} }.compact
                  })

      data.merge!({
                    collections: record.collections.includes(:owner).preload(:owner).collect { |c| {title: c.title, description: c.description, owner: c.owner.attributes} }.compact
                  })

      data
    end
  end
end