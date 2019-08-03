if defined?(LayersOfLondon::Booth)
  LayersOfLondon::Booth::MapTool.configure do |config|
    config.square_size = 3000   #metres
    config.north_west_extent = [51.5667,-0.2537]
    config.south_east_extent = [51.4498,0.0124]
  end
end
