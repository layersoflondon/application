namespace :georeferencer do
  desc "Clear the cache of Georeferencer images"
  task clear_cache: :environment do
    Rails.cache.delete_matched("*georeferencer*")
  end

  desc "Warm the cache of Georeferencer images"
  task warm_cache: :environment do
    Georeferencer::Project.all.each do |p|
      Georeferencer::Image.unreferenced.where(collection: p.georeferencer_id).fetch
    end
  end

  task "Reset the Georeferencer cache and warm it"
  task reset_cache: :environment do
    Rake::Task["georeferencer:clear_cache"].invoke
    Rake::Task["georeferencer:warm_cache"].invoke

  end


end