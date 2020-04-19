if defined?(LayersOfLondon::Booth)
  LayersOfLondon::Booth::MapTool.configure do |config|
    config.square_size = 300   #metres
    config.north_west_extent = [51.5667,-0.2537]
    config.south_east_extent = [51.4498,0.0124]
    config.polygons_url = case Rails.env
                          when "development"
                            "http://localhost:1234/{z}/{x}/{y}.pbf"
                          else
                            "/booth-polygons/{z}/{x}/{y}.pbf"
                          end
  end
end
