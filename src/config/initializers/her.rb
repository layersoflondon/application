class GeoreferencerParser < Faraday::Response::Middleware
  def on_complete(env)
    json = Oj.load(env[:body], symbolize_keys: true)
    if json.has_key?("@list")
      start = nil

      if json["next"].present?
        query = URI.parse(json["next"]).query
        start = query.scan(/start=([^$]+)/).flatten.first
      end

      body = {
        data: json["@list"]
      }

      body.merge!({metadata: {start: start}}) if start
      env[:body] = body
    else
      env[:body] = {
        data: json.with_indifferent_access
      }
    end
  end
end

class FixQueryParams < Faraday::Middleware
  def call(env)
    env.url.query = env.url.query.gsub(/%25/,'%')
    @app.call(env)
  end
end

Her::API.setup url: "https://layersoflondon.georeferencer.com" do |c|
  # Request
  c.use FaradayMiddleware::Caching, Rails.cache.class.new
  c.use FixQueryParams
  c.use Faraday::Request::UrlEncoded

  # Response
  c.use GeoreferencerParser

  # Adapter
  c.use Faraday::Adapter::NetHttp
end
