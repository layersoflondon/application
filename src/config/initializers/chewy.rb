Chewy.strategy(:active_job)
Chewy.logger = Logger.new(STDOUT)
Chewy.settings = {
  prefix: ENV['ELASTIC_SEARCH_PREFIX'] || Rails.env,
  host: Rails.env.development? ? "elasticsearch:9200" : "db01.lol:9200"
}