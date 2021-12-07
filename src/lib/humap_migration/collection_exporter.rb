module HumapMigration
  class CollectionExporter
    COLLECTIONS = Collection.all.includes(:records).references(:records).preload(:owner)

    def self.export!(dir = nil)
      self.new.export!(dir)
    end

    def export!(dir = nil)
      count = COLLECTIONS.count
      folder = dir ? File.expand_path(dir) : Rails.root.join("export", "collections")
      puts "Exporting to #{folder}"
      FileUtils.mkdir_p(folder)
      COLLECTIONS.all.each_with_index do |collection, i|
        begin
          print "\r #{i + 1} / #{count}"
          file = File.join(folder, "#{collection.id}.json")
          next if File.exists?(file)
          File.open(file, "w+") { |f| f.write data_for(collection).to_json }
        rescue => e
          FileUtils.rm(file, force: true)
          $stderr.puts "Error exporting collection ID #{collection.id}: #{e}"
          next
        end
      end
    end

    def data_for(collection)
      { id: collection.id,
        title: collection.title,
        description: collection.description,
        state: (collection.public_read? ? "published" : "unpublished"),
        owner: collection.owner.attributes.merge({ type: collection.owner.class.to_s.underscore }),
        record_ids: collection.record_ids
      }
    end
  end
end