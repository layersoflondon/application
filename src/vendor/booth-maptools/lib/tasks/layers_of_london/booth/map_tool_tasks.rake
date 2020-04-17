# desc "Explaining what the task does"
# task :layers_of_london_booth_map_tool do
#   # Task goes here
# end
#
#
require 'fileutils'
STDOUT.sync = true
namespace :booth do
  desc "Export booth polygons to a filesystem of vector tiles"
  task generate_vectors: :environment do
    tmp_folder = File.join(Rails.root, 'tmp', 'polygons')
    FileUtils.mkdir_p(tmp_folder)
    public_folder = File.join(Rails.root, 'public')


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

    puts "creating vector tiles"

    docker = IO.popen(["docker", "run", "-it", "--rm", "-v","#{tmp_folder}:/data", "-v","#{public_folder}:/public", "application_tippecanoe"])


    until docker.eof?
      line = docker.gets
      puts line
    end
  end

end
