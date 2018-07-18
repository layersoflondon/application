module Alpha
  module DatabaseConnection
    extend ActiveSupport::Concern

    DB = YAML::load(ERB.new(File.read(Rails.root.join("config","legacy.yml"))).result)

    included do
      establish_connection DB
    end
  end
end