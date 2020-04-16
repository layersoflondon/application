require 'geokit'

require "layers_of_london/booth/map_tool/engine"

module LayersOfLondon
  module Booth
    module MapTool
      class << self
        attr_accessor :configuration
      end

      def self.configure
        self.configuration ||= Configuration.new
        yield(configuration)
      end

      class Configuration
        attr_accessor :square_size, :north_west_extent, :south_east_extent

        def north_west
          @north_west ||= Geokit::LatLng.new(*@north_west_extent)
        end

        def south_east
          @south_east ||= Geokit::LatLng.new(*@south_east_extent)
        end

        def north_east
          @north_east ||= Geokit::LatLng.new(north_west.lat, south_east.lng)
        end

        def south_west
          @south_west ||= Geokit::LatLng.new(south_east.lat, north_west.lng)
        end

        def squares_x
          @squares_x ||= (north_west.distance_to(north_east, units: :meters) / @square_size).ceil
        end

        def squares_y
          @squares_y ||= (north_west.distance_to(south_west, units: :meters) / @square_size).ceil
        end
      end
    end
  end
end
