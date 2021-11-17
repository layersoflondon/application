namespace :humap_export do
  desc "Export records to json"
  task :records, [:output_dir, :limit] => :environment do |task, args|
    HumapMigration::RecordExporter.export!(args[:output_dir], args[:limit])
  end

  task :layers, [:output_dir] => :environment do |task, args|
    HumapMigration::LayerExporter.export!(args[:output_dir])
  end

  task :users, [:output_dir] => :environment do |task, args|
    HumapMigration::UserExporter.export!(args[:output_dir])
  end

end