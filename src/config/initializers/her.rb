class GeoreferencerParser < Faraday::Response::Middleware
  def on_complete(env)
    json = Oj.load(env[:body], symbolize_keys: true)

    if json.has_key?("@list")
      env[:body] = {
        data: json["@list"]
      }
    else
      env[:body] = {
        data: json.with_indifferent_access
      }
    end
  end
end

Her::API.setup url: "https://layersoflondon.georeferencer.com" do |c|
  # Request
  c.use Faraday::Request::UrlEncoded

  # Response
  c.use GeoreferencerParser

  # Adapter
  c.use Faraday::Adapter::NetHttp
end
