namespace :assets do
  desc "Generate variants of different sizes for the application"
  task generate_variants: :environment do
    Attachments::Image.all.each(&:save)
  end
end