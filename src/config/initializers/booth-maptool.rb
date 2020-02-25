if defined?(LayersOfLondon::Booth)
  LayersOfLondon::Booth::MapTool.configure do |config|
    config.square_size = 300   #metres
    config.north_west_extent = [51.5667,-0.2537]
    config.south_east_extent = [51.4498,0.0124]
    config.editable_adjacent_range = 2 # how many rows/columns either side of the current square should be editable
  end
end
