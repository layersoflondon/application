namespace :lol do
  desc "Seed featured items"
  task generate_featured_items: :environment do
    items = YAML.load_file(File.join(Rails.root, 'db','featured_item_seeds.yml')).collect(&:with_indifferent_access)
    items.each_with_index do |item, i|
      FeaturedItem.find_or_create_by(item_id: item[:item_id], item_type: item[:item_type], sort_order: i+1)
    end
  end
end