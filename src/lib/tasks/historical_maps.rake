namespace :lol do
  desc "Generate tiled historical map layers"
  task generate_historical_maps: :environment do
    # Load seed file
    layers = YAML.load_file(File.join(Rails.root, 'db','layer_seeds','layer_seeds.yml')).collect(&:with_indifferent_access)
    layers.each do |layer|
      puts "Importing #{layer[:title]}"
      if Layer.where(title: layer[:title]).any?
        puts "\t(Exists, skipping)"
        next
      end
      l = Layer.new({
                      title: layer[:title],
                      description: layer[:description],
                      layer_type: "tileserver",
                      layer_data: {url: layer[:url]},
                      lat: 51.5326,
                      lng: -0.12385,
                      date_from: layer[:date]
                    })
      i = Attachments::Image.new({
                                   title: "Image of #{layer[:title]}",
                                   caption: "Image of #{layer[:title]}"})
      i.file.attach(io: File.open(File.join(Rails.root,"db","layer_seeds", layer[:image])), filename: layer[:image])
      l.image = i
      l.save
    end
    LayersIndex.import
  end
end