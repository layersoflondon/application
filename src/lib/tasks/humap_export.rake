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

  task :collections, [:output_dir] => :environment do |task, args|
    HumapMigration::CollectionExporter.export!(args[:output_dir])
  end

  task record_checksums: :environment do
    hash = User.includes(:records).references(:records).inject({}) do |hash, user|
      STDERR.puts user.id
      hash[user.id] = Digest::MD5.hexdigest(user.records.collect(&:id).compact.sort.to_json)
      hash
    end

    puts hash.to_yaml
  end

  task collection_checksums: :environment do
    hash = User.includes(:collections).references(:collections).inject({}) do |hash, user|
      STDERR.puts user.id
      hash[user.id] = Digest::MD5.hexdigest(user.collections.collect(&:id).compact.sort.to_json)
      hash
    end

    puts hash.to_yaml
  end
end