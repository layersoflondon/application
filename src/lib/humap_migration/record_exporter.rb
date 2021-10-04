module HumapMigration
  class RecordExporter
    RECORDS = Record.includes(:user, :attachments, :tag_groups, :tags).preload(attachments: :attachable, collections: :owner)

    def self.export!(dir = nil, limit = nil)
      self.new.export!(dir, limit)
    end

    def export!(dir = nil, limit = nil)
      count = RECORDS.count
      records = limit ? RECORDS.limit(limit) : RECORDS.all
      folder = dir ? File.expand_path(dir) : Rails.root.join("export", "records")
      puts "Exporting to #{folder}"
      FileUtils.mkdir_p(folder)

      records.each_with_index do |record, i|
        begin
          print "\r #{i + 1} / #{count}"
          file = File.join(folder, "#{record.id}.json")
          next if File.exists?(file)
          File.open(file, "w+") { |f| f.write data_for(record).to_json }
        rescue => e
          $stderr.puts "Error exporting ID #{record.id}: #{e}"
          next
        end
      end
    end

    def data_for(record)
      user = (record.try(:user).try(:attributes) || {}).except(:primary_image)
      user.merge!({teams: record.try(:user).team_users.joins(:team).collect {|tu| tu.team.attributes.merge(state: tu.state)}})
      data = record.attributes.except(:description).merge({
                                                            user: user,
                                                            team: record.editing_team.try(:attributes),
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
                    collections: record.collections.includes(:owner).preload(:owner).collect { |c| {id: c.id, title: c.title, description: c.description, state: (c.public_read? ? "published" : "draft"), owner: c.owner.attributes.merge({type: c.owner.class.to_s.underscore})} }.compact
                  })

      data
    end
  end
end