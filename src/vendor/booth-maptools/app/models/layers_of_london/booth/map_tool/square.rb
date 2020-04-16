require 'cmath'
module LayersOfLondon::Booth::MapTool
  class Square < ApplicationRecord
    has_many :polygons, dependent: :destroy

    belongs_to :user, optional: true


    validates_presence_of :north_west_lat, :north_west_lng, :south_east_lat, :south_east_lng, :square_size

    before_validation on: :create do
      self.north_west_lat = self.north_west_lat
      self.north_west_lng = self.north_west_lng
      self.square_size = LayersOfLondon::Booth::MapTool.configuration.square_size
      self.south_east_lat = south_east.lat
      self.south_east_lng = south_east.lng
      self.geojson = self.to_geojson
    end

    serialize :geojson, JSON

    include AASM
    aasm do
      state :not_started, initial: true
      state :in_progress
      state :done
      state :verified
      state :flagged

      event :mark_as_in_progress do
        transitions from: :not_started, to: [:in_progress]
      end

      event :mark_as_done do
        transitions from: [:in_progress, :flagged], to: :done
      end

      event :mark_as_verified do
        transitions from: [:done], to: :verified
      end

      event :mark_as_flagged do
        transitions from: [:in_progress, :done, :flagged], to: :flagged
      end

      event :mark_as_back_in_progress do
        transitions from: [:flagged, :done, :verified], to: :in_progress
      end
    end

    def self.grid_coordinates
      config = LayersOfLondon::Booth::MapTool.configuration
      down = (config.squares_x + 1).times.collect do |col|
        top = config.north_west.endpoint(90,col*config.square_size, units: :meters)
        bottom = top.endpoint(180, config.squares_y*config.square_size, units: :meters)
        [
          top.to_a.reverse,
          bottom.to_a.reverse
        ]
      end

      across = (config.squares_y + 1).times.collect do |col|
        left = config.north_west.endpoint(180,col*config.square_size, units: :meters)
        right = left.endpoint(90, config.squares_x*config.square_size, units: :meters)
        [
          left.to_a.reverse,
          right.to_a.reverse
        ]
      end

      down + across
    end

    def to_json(padding: 0)
      # {id: id, state: {label: aasm_state, description: aasm_state.humanize}, geojson: to_geojson(padding: padding)}
      #
      state = {label: aasm_state, description: aasm_state.humanize}
      state.merge!({user: {id: user.id}}) if aasm_state === "done"

      {id: id, geojson: to_geojson(padding: padding)}.merge({state: state})
    end

    def to_geojson(padding: 0)
      distance_diagonally = CMath.sqrt((padding * padding) + (padding * padding))
      north_west_padded = padding.zero? ? north_west : north_west.endpoint(315,distance_diagonally, units: :meters)
      north_east_padded = padding.zero? ? north_east : north_east.endpoint(45,distance_diagonally, units: :meters)
      south_east_padded = padding.zero? ? south_east : south_east.endpoint(135,distance_diagonally, units: :meters)
      south_west_padded = padding.zero? ? south_west : south_west.endpoint(225,distance_diagonally, units: :meters)
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            # [
              [
                north_west.to_a.reverse,
                south_west.to_a.reverse,
                south_east.to_a.reverse,
                north_east.to_a.reverse,
                north_west.to_a.reverse
              ]#,
            #   [
            #     LayersOfLondon::Booth::MapTool.configuration.north_west.to_a.reverse,
            #     LayersOfLondon::Booth::MapTool.configuration.north_east.to_a.reverse,
            #     LayersOfLondon::Booth::MapTool.configuration.south_east.to_a.reverse,
            #     LayersOfLondon::Booth::MapTool.configuration.south_west.to_a.reverse,
            #     LayersOfLondon::Booth::MapTool.configuration.north_west.to_a.reverse,
            #   ]
            # ]

          ]
        },
        properties: {
          id: id,
          state: aasm_state,
          centroid: centroid.to_a.collect {|coord| coord.round(5)}
        }
      }
    end

    def north_west
      Geokit::LatLng.new(north_west_lat, north_west_lng)
    end

    def north_east
      north_west.endpoint(90, square_size, units: :meters)
    end

    def south_west
      north_west.endpoint(180, square_size, units: :meters)
    end

    def south_east
      south_west.endpoint(90, square_size, units: :meters)
    end

    def centroid
      north_west.midpoint_to(south_east)
    end

    def editable?
      !aasm_state.in?(["done", "flagged", "verified"])
    end

  end
end
