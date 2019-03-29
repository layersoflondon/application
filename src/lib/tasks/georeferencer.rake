namespace :georeferencer do
  desc "Clear the cache of Georeferencer images"
  task clear_cache: :environment do
    Rails.cache.delete_matched("*georeferencer*")
  end

  desc "Warm the cache of Georeferencer images"
  task :warm_cache, [:georeferencer_id]  => :environment do |task, args|
    projects = args[:georeferencer_id].present? ? Georeferencer::Project.where(georeferencer_id: args[:georeferencer_id]) : Georeferencer::Project.all
    projects.each do |p|
      Rails.cache.fetch(p.images_cache_key) do
        Georeferencer::Image.unreferenced.where(collection: p.georeferencer_id).to_a
      end

      Rails.cache.fetch(p.progress_cache_key) do
        Georeferencer::Progress.find(p.georeferencer_id)
      end
    end
  end

  task "Reset the Georeferencer cache and warm it"
  task reset_cache: :environment do
    Rake::Task["georeferencer:clear_cache"].invoke
    Rake::Task["georeferencer:warm_cache"].invoke

  end


end