namespace :lol do
  @migration = Alpha::Migration.new
  desc "Set up migration tasks"
  task setup: :environment do
    puts "starting migration"
  end

  desc "Migrate users"
  task migrate_users: :setup do
    puts "migrating users"
    @migration.migrate_users
  end

  desc "Migrate groups"
  task migrate_groups: :migrate_users do
    puts "migrating groups"
    @migration.migrate_groups
  end

  desc "Migrate pins"
  task migrate_pins: :migrate_groups do
    puts "migrating pins"
    @migration.migrate_pins
  end

  desc "Migrate collections"
  puts "migrating collections"
  task migrate_collections: :migrate_pins do
    @migration.migrate_collections
  end

  desc "Migrate all"
  task migrate: [:setup, :migrate_users, :migrate_groups, :migrate_pins, :migrate_collections] do
    
  end

end