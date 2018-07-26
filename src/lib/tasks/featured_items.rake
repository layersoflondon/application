namespace :lol do
  desc "Seed featured items"
  task generate_featured_items: :environment do
    items = YAML.load_file(File.join(Rails.root, 'db','featured_item_seeds.yml')).collect(&:with_indifferent_access)
    items.each do |item|
      FeaturedItem.find_or_create_by(item_id: item[:item_id], item_type: item[:item_type])
    end
  end
end