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


      data = layer_group.attributes.except(:description)
      if layer_group.image.present?
        data.merge!({
                      image: {
                        url: layer_group.image.data[:url],
                        title: layer_group.image.title,
                        caption: layer_group.image.caption,
                        credit: layer_group.image.credit
                      }
                    })
      end
      data.merge!({
                    description: CGI.escape_html(layer_group.description)
                  })

      data.merge!({
                    layers: Array.wrap(layers_with_metadata(layer_group))
                  })

      data
    end

    def layers_with_metadata(layer_group)
      layer_group.layers.collect do |layer|
        layer_data = layer.attributes.except(:description, :layer_data)
        layer_data.merge!({
                            description: CGI.escape_html(layer.description)
                          })
        layer_data.merge!({
                            taxonomy_terms: layer.layer_terms.includes(:layer_category).references(:layer_category).collect {|t| {name: t.name, category: t.layer_category.name}}
                          })
        begin
          # Using the z/x/y URL, list the contents of the bucket for that tileset. Get the highest and lowest zoom values.
          #  at zoom level 13 (which is a representatively small size of tile for accuracy) get the highest and lowest number, and then from each of those, get the highest and lowest numbers.
          # (lowest x, highest y+1) = soutwest extent
          # (highest x+1, lowest y) = north-east extent
          # Then we can get the lat/lng for the top left corner from get_lat_lng_for_number.
          #
          # The layer needs to have centroid (lat/lng), southwest extent, northeast extent, min and max zooms
          #
          #
          #

          if layer.layer_data["url"].match(%r{tiles.layersoflondon.org})
            # Get the extent and zoom from the tiles on s3
            sw_extent, ne_extent, min_zoom, max_zoom = parse_s3_tileset(layer)
          elsif layer.layer_data["url"].match(%r{georeferencer.com})
            #   Get the extent and zoom from the tilejson at map.json
            tilejson = JSON.parse(open(layer.layer_data["url"].gsub("/map/{z}/{x}/{y}.png", "/map.json").strip).read)
            min_zoom = tilejson["minzoom"]
            max_zoom = tilejson["maxzoom"]
            bounds = tilejson["bounds"]
            sw_extent = {lat: bounds[1], lon: bounds[0]}
            ne_extent = {lat: bounds[3], lon: bounds[2]}
          elsif layer.layer_data["url"].match(%r{mapseries-tilesets.s3.amazonaws.com})
            #   Get the extent and zoom from the json at metadata.json
            tilejson = JSON.parse(open(layer.layer_data["url"].gsub("/{z}/{x}/{y}.png","/metadata.json").strip).read)
            min_zoom = tilejson["minzoom"].to_i
            max_zoom = tilejson["maxzoom"].to_i
            bounds = tilejson["bounds"].split(",").collect(&:to_f)
            sw_extent = {lat: bounds[1], lon: bounds[0]}
            ne_extent = {lat: bounds[3], lon: bounds[2]}
          end

          centroid_lat = sw_extent[:lat] + ((ne_extent[:lat] - sw_extent[:lat]) / 2)
          centroid_lon = sw_extent[:lon] + ((ne_extent[:lon] - sw_extent[:lon]) / 2)
          

          layer_data.merge!({
                              metadata: layer.layer_data.merge({
                                min_zoom: min_zoom,
                                max_zoom: max_zoom,
                                sw_extent: sw_extent,
                                ne_extent: ne_extent,
                                centroid: {lat: centroid_lat, lon: centroid_lon}
                              })
                            })
          layer_data
        rescue => e
          $stderr.puts "#{layer.id},#{layer.title.gsub(","," ")},#{e}"
          return layer_data
        end

      end
    end


    private
    # see https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_numbers_to_lon..2Flat._3
    def get_lat_lng_for_number(xtile, ytile, zoom)
      n = 2.0 ** zoom
      lon_deg = xtile / n * 360.0 - 180.0
      lat_rad = Math::atan(Math::sinh(Math::PI * (1 - 2 * ytile / n)))
      lat_deg = 180.0 * (lat_rad / Math::PI)
      {:lat => lat_deg, :lon => lon_deg}
    end

    def list_zoomlevels(layer)
      raise ArgumentError, "Layer is not on tiles.layersoflondon.org: #{layer.layer_data["url"]}" unless layer.layer_data["url"].match(%r{tiles.layersoflondon.org})
      prefix = layer.layer_data["url"].split("/")[3..-4].join("/") << "/"
      result = ActiveStorage::Blob.service.client.client.list_objects_v2(bucket: "tiles.layersoflondon.org", prefix: prefix, delimiter: "/")
      result.common_prefixes.collect(&:prefix).collect {|p| p.split("/").last.to_i}.sort
    end

    def list_x_folders(layer, zoom: 13)
      # Get a list of folders for a given zoomlevel, return the integer names of those, sorted.
      raise ArgumentError, "Layer is not on tiles.layersoflondon.org: #{layer.layer_data["url"]}" unless layer.layer_data["url"].match(%r{tiles.layersoflondon.org})
      prefix = layer.layer_data["url"].split("/")[3..-4].join("/") << "/#{zoom}/"
      result = ActiveStorage::Blob.service.client.client.list_objects_v2(bucket: "tiles.layersoflondon.org", prefix: prefix, delimiter: "/")
      result.common_prefixes.collect(&:prefix).collect {|p| p.split("/").last.to_i}.sort
    end

    def list_y_files(layer, zoom: 13, x:)
      # Get a list of files in a folder in the form 1234.pbf or 1234.png (any suffix A-z, 3 or 4 chars)
      # Return the integers of those file names, sorted
      raise ArgumentError, "Layer is not on tiles.layersoflondon.org: #{layer.layer_data["url"]}" unless layer.layer_data["url"].match(%r{tiles.layersoflondon.org})
      prefix = layer.layer_data["url"].split("/")[3..-4].join("/") << "/#{zoom}/#{x}/"
      result = ActiveStorage::Blob.service.client.client.list_objects_v2(bucket: "tiles.layersoflondon.org", prefix: prefix, delimiter: "/")
      result.contents.collect(&:key).collect {|k| k.split("/").last}.select {|k| k.match(%{\.[A-z]{3,4}$})}.collect {|k| k.split(".")[0..-2].join(".").try(:to_i) || 0}.sort
    end

    def parse_s3_tileset(layer)
      zoomlevels = list_zoomlevels(layer)
      x_folders = list_x_folders(layer, zoom: 13)
      raise ArgumentError, "No x folders at zoom level 13 - possibly a bad URL?" unless x_folders.any?
      y_files_min_x = list_y_files(layer, x: x_folders.min)
      raise ArgumentError, "No y files for x: #{x_folders.min}" unless y_files_min_x.any?
      y_files_max_x = list_y_files(layer, x: x_folders.max)
      raise ArgumentError, "No y files for x: #{x_folders.max}" unless y_files_max_x.any?
      sw_extent = get_lat_lng_for_number(x_folders.min, y_files_min_x.max + 1, 13)
      ne_extent = get_lat_lng_for_number(x_folders.max+1, y_files_max_x.min, 13)

      [sw_extent, ne_extent, zoomlevels.min, zoomlevels.max]

    end




  end
end