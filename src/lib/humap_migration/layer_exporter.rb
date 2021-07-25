module HumapMigration
  class LayerExporter
    LAYERS = LayerGroup.includes(:layers).references(:layers)

    def self.export!(dir = nil)
      self.new.export!(dir)
    end

    def export!(dir = nil)
      count = LAYERS.count
      folder = dir ? File.expand_path(dir) : Rails.root.join("export", "layers")
      puts "Exporting to #{folder}"
      FileUtils.mkdir_p(folder)
      LAYERS.all.each_with_index do |layer, i|
        begin
          print "\r #{i + 1} / #{count}"
          file = File.join(folder, "#{layer.id}.json")
          next if File.exists?(file)
          File.open(file, "w+") { |f| f.write data_for(layer).to_json }
        rescue => e
          $stderr.puts "Error exporting layer ID #{layer.id}: #{e}"
          next
        end
      end
    end

    def data_for(layer_group)
      data = layer_group.attributes.except(:description).merge({
                                                            image: layer_group.image.try(:data).try(:dig, *[:title, :url, :credit, :caption])
                                                          })
      data.merge!({
                    description: CGI.escape_html(layer_group.description)
                  })

      data.merge!({
                    layers: layer_group.layers.collect do |layer|
                      layer_data = layer.attributes.except(:description)
                      layer_data.merge!({
                                    description: CGI.escape_html(layer.description)
                                  })
                      layer_data
                    end
                  })

      data
    end
  end
end