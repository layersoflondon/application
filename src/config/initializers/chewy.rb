Chewy.strategy(:atomic)
Chewy.logger = Logger.new(STDOUT)
Chewy.settings = {
  prefix: Rails.env,
  host: Rails.env.production? ? "db01.lol:9200" : "127.0.0.1:9200"
}