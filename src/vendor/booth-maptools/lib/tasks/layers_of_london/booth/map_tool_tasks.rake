# desc "Explaining what the task does"
# task :layers_of_london_booth_map_tool do
#   # Task goes here
# end
#
#
require 'fileutils'
namespace :booth do
  desc "Export booth polygons to a filesystem of vector tiles"
  task generate_vectors: :environment do
    tmp_folder = File.join(Rails.root, 'tmp', 'polygons')
    FileUtils.mkdir_p(tmp_folder)
    public_folder = File.join(Rails.root, 'public')
    polygons_folder_name = 'polygons'


    puts "Getting GeoJSON"

    LayersOfLondon::Booth::MapTool::Polygon.colours.keys.each do |colour|
      puts "\t#{colour}"
      
      filename = "#{colour}.geojson"
      filepath = File.join(tmp_folder, filename)
      File.open(filepath, "w+") do |file|
        features = LayersOfLondon::Booth::MapTool::Polygon.includes(:user, square: [:user]).send(colour.to_sym).collect(&:to_json)

        feature_collection = {
          type: "FeatureCollection",
          features: features
        }

        file.write feature_collection.to_json
      end
    end

    # puts "GeoJSON written, converting to MBTiles"
    #
    # `docker run -it --rm  -v #{tmp_folder}:/data application_tippecanoe tippecanoe --force --output=/data/polygons.mbtiles /data/#{filename}`
    # `docker run -it --rm  -v /Users/edj/development/error_dev/lol/application/src/tmp:/data application_tippecanoe /usr/local/bin/tippecanoe --force --output=/data/polygons.mbtiles /data/polygons.geojson`
    # `docker run -it --rm  -v /Users/edj/development/error_dev/lol/application/src/public:/public -v /Users/edj/development/error_dev/lol/application/src/tmp:/data application_tippecanoe rm -rf /public/polygons && /usr/bin/mb-util --image_format=pbf /data/polygons.mbtiles /public/polygons`
    #
    # puts "MBTiles created, exporting to filesystem"
    #
    # File.unlink(File.join(public_folder, polygons_folder_name))
    #
    # `docker run -it --rm  -v #{tmp_folder}:/data -v #{public_folder}:/public application_tippecanoe mb-util --image_format=pbf /data/#{filename} /public/#{polygons_folder_name}`
    # `docker run -it --rm  -v #{tmp_folder}:/data -v #{public_folder}:/public application_tippecanoe mb-util --image_format=pbf /data/#{filename} /public/#{polygons_folder_name}`

  end

end
